declare module 'zeptomail' {
  export interface EmailAddress {
    address: string;
    name?: string;
  }

  export interface EmailRecipient {
    email_address: EmailAddress;
  }

  export interface SendMailPayload {
    from: EmailAddress;
    to: EmailRecipient[];
    subject: string;
    htmlbody?: string;
    textbody?: string;
    track_opens?: boolean;
    track_clicks?: boolean;
    reply_to?: EmailAddress[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    attachments?: any[];
    inline_images?: any[];
  }

  export interface SendMailResponse {
    message: string;
    request_id?: string;
  }

  export interface SendMailClientConfig {
    url: string;
    token: string;
    debug?: boolean;
  }

  export class SendMailClient {
    constructor(config: SendMailClientConfig);
    sendMail(payload: SendMailPayload): Promise<SendMailResponse>;
    sendBatchMail(payload: any): Promise<any>;
    sendMailWithTemplate(payload: any): Promise<any>;
    mailBatchWithTemplate(payload: any): Promise<any>;
  }
}
