import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import Stripe from 'stripe';

import {
  STRIPE_WEBHOOK_HANDLER,
  StripeWebhookHandlerMetadata,
} from '../common/decorators/stripe-webhook-handler.decorator';

interface WebhookHandlerInfo {
  instance: Record<string, unknown>;
  methodName: string;
  eventName: string;
}

@Injectable()
export class StripeWebhookExplorerService implements OnModuleInit {
  private readonly logger = new Logger(StripeWebhookExplorerService.name);
  private webhookHandlers: Map<string, WebhookHandlerInfo[]> = new Map();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner
  ) {}

  onModuleInit() {
    this.explore();
  }

  /**
   * Explores all providers to find methods decorated with @StripeWebhookHandler
   */
  private explore() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;

      if (!instance || typeof instance !== 'object') {
        return;
      }
      const typedInstance = instance as Record<string, unknown>;

      this.metadataScanner.scanFromPrototype(
        typedInstance,
        Object.getPrototypeOf(typedInstance),
        (methodName: string) => this.lookupWebhookHandlers(typedInstance, methodName)
      );
    });

    // Log discovered handlers
    if (this.webhookHandlers.size === 0) {
      this.logger.warn('No Stripe webhook handlers discovered');
    } else {
      const eventNames = Array.from(this.webhookHandlers.keys()).sort();
      this.logger.log(
        `Discovered ${eventNames.length} webhook event type(s): ${eventNames.join(', ')}`
      );
    }
  }

  /**
   * Checks if a method is decorated with @StripeWebhookHandler and registers it
   */
  private lookupWebhookHandlers(instance: Record<string, unknown>, methodName: string) {
    const methodRef = instance[methodName];
    if (typeof methodRef !== 'function') return;

    // Get metadata from the webhook handler decorator if it exists
    const metadata = Reflect.getMetadata(
      STRIPE_WEBHOOK_HANDLER,
      methodRef
    ) as StripeWebhookHandlerMetadata;

    if (metadata && metadata.eventNames && metadata.eventNames.length > 0) {
      metadata.eventNames.forEach(eventName => {
        if (!this.webhookHandlers.has(eventName)) {
          this.webhookHandlers.set(eventName, []);
        }

        this.webhookHandlers.get(eventName)!.push({
          instance,
          methodName,
          eventName,
        });

        this.logger.debug(
          `Registered webhook handler: ${instance.constructor.name}.${methodName} for event: ${eventName}`
        );
      });
    }
  }

  /**
   * Processes a Stripe webhook event by executing all registered handlers for the event type
   */
  async processWebhookEvent(event: Stripe.Event): Promise<boolean> {
    const handlers = this.webhookHandlers.get(event.type) || [];

    if (handlers.length === 0) {
      this.logger.warn(`No handlers registered for webhook event: ${event.type}`);
      return false;
    }

    this.logger.debug(`Executing ${handlers.length} handler(s) for event type: ${event.type}`);

    const promises = handlers.map(async handler => {
      const { instance, methodName } = handler;
      const candidate = instance[methodName];
      if (typeof candidate !== 'function') {
        throw new Error(`Webhook handler ${methodName} is not a function.`);
      }

      try {
        await candidate.call(instance, event);
      } catch (error) {
        this.logger.error(
          `Error in webhook handler ${instance.constructor.name}.${methodName} for event ${event.type}: ${
            (error as Error).message
          }`,
          (error as Error).stack
        );
        throw error;
      }
    });

    await Promise.all(promises);
    return true;
  }

  /**
   * Get all discovered event types (useful for debugging)
   */
  getDiscoveredEventTypes(): string[] {
    return Array.from(this.webhookHandlers.keys()).sort();
  }

  /**
   * Get handlers for a specific event type (useful for testing)
   */
  getHandlersForEvent(eventType: string): WebhookHandlerInfo[] {
    return this.webhookHandlers.get(eventType) || [];
  }
}
