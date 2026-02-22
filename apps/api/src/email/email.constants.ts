export {
  EMAIL_DEFAULT_FROM_ADDRESS,
  EMAIL_DEFAULT_FROM_NAME,
  EMAIL_DEFAULT_SMTP_PORT,
  EMAIL_QUEUE_CONCURRENCY_DEFAULT,
  EMAIL_QUEUE_RATE_LIMIT_DURATION_MS_DEFAULT,
  EMAIL_QUEUE_RATE_LIMIT_MAX_DEFAULT,
  EMAIL_QUEUE_REMOVE_ON_COMPLETE_DEFAULT,
  EMAIL_QUEUE_REMOVE_ON_FAIL_DEFAULT,
} from '../config/defaults';

export enum EmailQueue {
  Name = 'email',
}

export enum EmailJobName {
  Send = 'send',
}

export enum EmailMetric {
  Success = 'email_send_success',
  Failure = 'email_send_failure',
  Retry = 'email_send_retry',
}

export enum SmtpPermanentErrorCode {
  Auth = 'EAUTH',
  Envelope = 'EENVELOPE',
  Message = 'EMESSAGE',
}

export const EMAIL_JOB_ATTEMPTS = 5;
export const EMAIL_JOB_BACKOFF_DELAY_MS = 1000;
