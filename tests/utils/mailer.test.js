const { sendMail } = require('../../src/utils/mailer');

describe('sendMail', () => {
  it('should send an email', async () => {
    const sender = { name: 'Test Sender', email: 'sender@test.com' };
    const to = [{ name: 'Test Recipient', email: 'recipient@test.com' }];
    const subject = 'Test email';
    const htmlContent = '<p>This is a test email.</p>';
    await expect(sendMail(sender, to, subject, htmlContent)).resolves.not.toThrow();
  });
});
