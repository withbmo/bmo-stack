import { SmtpEmailTransport } from '../../src/email/email.transport';

describe('SmtpEmailTransport', () => {
  const baseMessage = {
    toEmail: 'user@example.com',
    toName: 'user',
    subject: 'subject',
    html: '<p>hello</p>',
    text: 'hello',
  };

  it('returns message id when send succeeds', async () => {
    const mailerService = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'abc123' }),
    } as any;

    const configService = {
      runtime: {
        fromAddress: 'noreply@example.com',
        fromName: 'Pytholit',
      },
    } as any;

    const transport = new SmtpEmailTransport(mailerService, configService);
    const result = await transport.send(baseMessage);

    expect(result.messageId).toBe('abc123');
  });

  it('marks auth failures as permanent', async () => {
    const mailerService = {
      sendMail: jest.fn().mockRejectedValue({ code: 'EAUTH', message: 'Invalid login' }),
    } as any;

    const configService = {
      runtime: {
        fromAddress: 'noreply@example.com',
        fromName: 'Pytholit',
      },
    } as any;

    const transport = new SmtpEmailTransport(mailerService, configService);

    await expect(transport.send(baseMessage)).rejects.toMatchObject({
      kind: 'permanent',
    });
  });

  it('marks timeout failures as transient', async () => {
    const mailerService = {
      sendMail: jest.fn().mockRejectedValue({ code: 'ETIMEDOUT', message: 'Connection timeout' }),
    } as any;

    const configService = {
      runtime: {
        fromAddress: 'noreply@example.com',
        fromName: 'Pytholit',
      },
    } as any;

    const transport = new SmtpEmailTransport(mailerService, configService);

    await expect(transport.send(baseMessage)).rejects.toMatchObject({
      kind: 'transient',
    });
  });
});
