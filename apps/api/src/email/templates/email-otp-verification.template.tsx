import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export interface EmailOtpVerificationData {
  toEmail: string;
  toName: string;
  code: string;
  expiresInMinutes: number;
}

export function getEmailOtpVerificationSubject(): string {
  return 'Your Pytholit verification code';
}

export function EmailOtpVerificationTemplate(data: EmailOtpVerificationData): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {data.code}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.heading}>Verify your email</Heading>
          </Section>
          <Section style={styles.content}>
            <Text style={styles.text}>Hi {data.toName},</Text>
            <Text style={styles.text}>
              Use the one-time code below to verify your email and continue signing in:
            </Text>
            <Text style={styles.code}>{data.code}</Text>
            <Text style={styles.text}>
              This code expires in {data.expiresInMinutes} minutes.
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              If you did not request this code, you can ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    backgroundColor: '#ffffff',
    margin: 0,
    padding: '20px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  },
  header: {
    background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    padding: '28px',
  },
  heading: {
    color: '#ffffff',
    fontSize: '22px',
    margin: 0,
  },
  content: {
    backgroundColor: '#f9fafb',
    padding: '28px',
  },
  text: {
    color: '#111827',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 12px',
  },
  code: {
    fontSize: '34px',
    fontWeight: '700',
    letterSpacing: '0.24em',
    textAlign: 'center' as const,
    color: '#0f172a',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '14px',
    margin: '16px 0 20px',
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '20px 0',
  },
  footer: {
    color: '#6b7280',
    fontSize: '12px',
    margin: 0,
  },
};
