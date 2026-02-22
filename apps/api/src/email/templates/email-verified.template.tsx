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

export interface EmailVerifiedData {
  toEmail: string;
  toName: string;
}

export function getEmailVerifiedSubject(): string {
  return 'Email Verified Successfully';
}

export function EmailVerifiedTemplate(data: EmailVerifiedData): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>Your email address has been verified successfully.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.heading}>Email Verified!</Heading>
          </Section>
          <Section style={styles.content}>
            <Text style={styles.text}>Hi {data.toName},</Text>
            <Text style={styles.text}>
              Your email address has been successfully verified. You now have full access to all
              features.
            </Text>
            <Text style={styles.checkmark}>✓</Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              This is an automated message. Please do not reply directly to this email.
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
  },
  header: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    padding: '30px',
  },
  heading: {
    color: '#ffffff',
    fontSize: '24px',
    margin: 0,
  },
  content: {
    backgroundColor: '#f9f9f9',
    padding: '30px',
  },
  text: {
    color: '#333333',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 12px',
  },
  checkmark: {
    fontSize: '48px',
    lineHeight: '1',
    textAlign: 'center' as const,
    margin: '20px 0',
  },
  hr: {
    borderColor: '#eeeeee',
    margin: '20px 0',
  },
  footer: {
    color: '#999999',
    fontSize: '12px',
    margin: 0,
  },
};
