import { Gauge } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button, DashboardPageHeader, DynamicSkeletonProvider, Input } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import {
  getUsageSettings,
  updateUsageSettings,
  type UsageEventSettings,
  type UsageSettingsResponse,
} from '@/shared/lib/billing';

type UsageEventConfig = UsageEventSettings;

function PercentBar({ consumed, max }: { consumed: number; max: number | null }) {
  const percent = max && max > 0 ? Math.min(100, Math.round((consumed / max) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="h-2 w-full border border-border-default bg-bg-surface overflow-hidden">
        <div
          className="h-full bg-border-highlight transition-all duration-200"
          style={{ width: `${max === null ? 100 : percent}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-text-primary/75 uppercase tracking-wider">
        {consumed.toLocaleString()} used{max === null ? ' · Unlimited' : ` / ${max.toLocaleString()}`}
      </p>
    </div>
  );
}

export const UsageTab = () => {
  const { hydrated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [usageSettings, setUsageSettings] = useState<UsageSettingsResponse | null>(null);
  const [events, setEvents] = useState<UsageEventConfig[]>([]);

  useEffect(() => {
    if (!hydrated || !user) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const settings = await getUsageSettings(undefined);
        if (cancelled) return;
        setUsageSettings(settings);
        setEvents(settings.events);
      } catch (err: any) {
        if (!cancelled) {
          toast.error(err?.detail || 'Failed to load usage settings');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, user]);

  const currentCredits = usageSettings?.currentCredits ?? 0;

  const hasChanges = useMemo(() => {
    if (!usageSettings) return false;
    return usageSettings.events.some(saved => {
      const draft = events.find(item => item.eventName === saved.eventName);
      if (!draft) return false;
      return draft.unlimited !== saved.unlimited || draft.maxCredits !== saved.maxCredits;
    });
  }, [events, usageSettings]);

  const handleSave = async () => {
    if (!hydrated || !user || !hasChanges || isSaving) return;
    try {
      setIsSaving(true);
      const updated = await updateUsageSettings(undefined, {
        events: events.map(item => ({
          eventName: item.eventName,
          unlimited: item.unlimited,
          maxCredits: item.unlimited ? undefined : Math.max(item.maxCredits ?? 0, 0),
        })),
      });
      setUsageSettings(updated);
      setEvents(updated.events);
      toast.success('Usage limits updated');
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to update usage settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DynamicSkeletonProvider loading={isLoading}>
    <div className="space-y-6">
      <DashboardPageHeader
        badge={{ icon: Gauge, label: 'USAGE' }}
        title="USAGE CONTROLS"
        subtitle="Set per-event credit caps and monitor credit consumption"
        variant="minimal"
        className="mb-2 border-0 pb-2"
      />

      <div className="border border-border-default bg-bg-panel">
        <div className="px-6 py-4 border-b border-border-default">
          <p className="font-mono text-[10px] text-text-primary/80 uppercase tracking-widest">
            Current Credits
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-sans font-bold text-text-primary">
            {currentCredits.toLocaleString()}
          </p>
          <p className="mt-2 font-mono text-xs text-text-primary/75">
            Available credits for this account
          </p>
        </div>
      </div>

      <div className="border border-border-default bg-bg-panel">
        <div className="px-6 py-4 border-b border-border-default">
          <p className="font-mono text-[10px] text-text-primary/80 uppercase tracking-widest">
            Event Limits
          </p>
        </div>
        <div className="divide-y divide-border-default">
          {events.map(event => {
            const unlimited = event.maxCredits === null;
            return (
              <div key={event.eventName} className="px-6 py-5 grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="space-y-3">
                  <p className="font-mono text-xs text-text-primary uppercase tracking-wider">
                    {event.label}
                  </p>
                  <PercentBar consumed={event.consumedCredits} max={event.maxCredits} />
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 font-mono text-[10px] text-text-primary/80 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={unlimited}
                      onChange={checkedEvent => {
                        const checked = checkedEvent.target.checked;
                        setEvents(previous =>
                          previous.map(item =>
                            item.eventName === event.eventName
                              ? {
                                  ...item,
                                  unlimited: checked,
                                  maxCredits: checked
                                    ? null
                                    : Math.max(item.maxCredits ?? item.consumedCredits, 1),
                                }
                              : item
                          )
                        );
                      }}
                    />
                    Unlimited
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={event.maxCredits === null ? '' : String(event.maxCredits)}
                    onChange={inputEvent => {
                      const raw = Number(inputEvent.target.value);
                      setEvents(previous =>
                        previous.map(item =>
                          item.eventName === event.eventName
                            ? {
                                ...item,
                                maxCredits: Number.isFinite(raw) && raw >= 0 ? Math.round(raw) : 0,
                              }
                            : item
                        )
                      );
                    }}
                    placeholder="Max credits"
                    disabled={unlimited}
                    variant="default"
                    intent="brand"
                    size="sm"
                    className="w-40"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          variant="primary"
          size="sm"
          disabled={!hasChanges || isSaving}
          isLoading={isSaving}
        >
          Save Usage Limits
        </Button>
      </div>
    </div>
    </DynamicSkeletonProvider>
  );
};
