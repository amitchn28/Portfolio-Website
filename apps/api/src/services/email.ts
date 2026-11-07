import net from 'net';
import tls from 'tls';
import { env } from '../config/env';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  simulated?: boolean;
  provider: 'resend' | 'smtp' | 'console';
  messageId?: string;
}

class HybridEmailService {
  private resendApiKey: string;
  private smtpHost: string;
  private smtpPort: number;
  private smtpUser: string;
  private smtpPass: string;
  private from: string;

  constructor() {
    this.resendApiKey = env.RESEND_API_KEY || '';
    this.smtpHost = env.SMTP_HOST || '';
    this.smtpPort = env.SMTP_PORT || 587;
    this.smtpUser = env.SMTP_USER || '';
    this.smtpPass = env.SMTP_PASSWORD || '';
    this.from = env.SMTP_FROM || `"Amit Chauhan Portfolio" <${env.OWNER_EMAIL}>`;
  }

  public isResendConfigured(): boolean {
    return Boolean(this.resendApiKey && this.resendApiKey.startsWith('re_'));
  }

  public isSmtpConfigured(): boolean {
    return Boolean(this.smtpHost && this.smtpUser && this.smtpPass);
  }

  public isLiveConfigured(): boolean {
    return this.isResendConfigured() || this.isSmtpConfigured();
  }

  /**
   * Primary email dispatch method with graceful fallback:
   * 1. Resend API (Preferred)
   * 2. Direct SMTP (Alternative)
   * 3. Structured Console Simulator (Localhost Development Mode)
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailDispatchResult> {
    // 1. Try Resend if configured
    if (this.isResendConfigured()) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.from,
            to: [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text,
          }),
        });

        const json = await res.json().catch(() => ({}));
        if (res.ok && json.id) {
          console.log(`✅ [EmailService] Dispatched via Resend: ${json.id}`);
          return { success: true, provider: 'resend', messageId: json.id };
        } else {
          console.warn(`⚠️ [EmailService] Resend API error:`, json);
          // Fall through to SMTP or console simulation
        }
      } catch (err) {
        console.warn(`⚠️ [EmailService] Resend dispatch failed, attempting fallback:`, err);
      }
    }

    // 2. Try SMTP if configured
    if (this.isSmtpConfigured()) {
      try {
        await this.dispatchSmtp(options);
        console.log(`✅ [EmailService] Dispatched via SMTP to ${options.to}`);
        return { success: true, provider: 'smtp', messageId: `smtp_${Date.now()}` };
      } catch (err) {
        console.error('⚠️ [EmailService] SMTP delivery error:', err);
        // Fall through to local simulation
      }
    }

    // 3. Localhost Development Fallback: Structured Console Output
    console.log('\n' + '='.repeat(68));
    console.log('📧 [EMAIL SERVICE — LOCAL DEVELOPMENT SIMULATOR]');
    console.log(`Provider:  Localhost Console Simulation (Configure RESEND_API_KEY in .env for live dispatch)`);
    console.log(`From:      ${this.from}`);
    console.log(`To:        ${options.to}`);
    console.log(`Subject:   ${options.subject}`);
    console.log('-'.repeat(68));
    console.log(options.text || options.html || '(No body provided)');
    console.log('='.repeat(68) + '\n');

    return { success: true, simulated: true, provider: 'console', messageId: `sim_${Date.now()}` };
  }

  private dispatchSmtp(options: SendEmailOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = (this.smtpPort === 465)
        ? tls.connect({ host: this.smtpHost, port: this.smtpPort, rejectUnauthorized: false })
        : net.connect({ host: this.smtpHost, port: this.smtpPort });

      let step = 0;
      const commands = [
        `EHLO localhost\r\n`,
        `AUTH LOGIN\r\n`,
        `${Buffer.from(this.smtpUser).toString('base64')}\r\n`,
        `${Buffer.from(this.smtpPass).toString('base64')}\r\n`,
        `MAIL FROM:<${this.smtpUser}>\r\n`,
        `RCPT TO:<${options.to}>\r\n`,
        `DATA\r\n`,
        `From: ${this.from}\r\nTo: ${options.to}\r\nSubject: ${options.subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${options.html || options.text}\r\n.\r\n`,
        `QUIT\r\n`,
      ];

      socket.setEncoding('utf-8');
      socket.setTimeout(10000);

      socket.on('data', () => {
        if (step < commands.length) {
          socket.write(commands[step]);
          step++;
        } else {
          socket.end();
          resolve();
        }
      });

      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('SMTP socket timeout'));
      });
    });
  }

  /**
   * Dispatches contact form submission notification to website owner (amitchn28@gmail.com)
   */
  async sendContactNotification(inquiry: {
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    ipAddress?: string | null;
  }): Promise<EmailDispatchResult> {
    const subject = `[Portfolio Inquiry] ${inquiry.name}: ${inquiry.subject || 'Website Message'}`;
    const dateFormatted = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #1e293b; border-radius: 12px; background-color: #070b16; color: #f1f5f9;">
        <div style="border-bottom: 2px solid #06b6d4; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #22d3ee; margin: 0 0 6px 0; font-size: 22px;">New Contact Message Received</h2>
          <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">Amit Chauhan Portfolio &bull; Localhost Integration</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #94a3b8; width: 120px;">Sender Name:</td>
            <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #94a3b8;">Sender Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${inquiry.email}" style="color: #22d3ee; text-decoration: none;">${inquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #94a3b8;">Subject:</td>
            <td style="padding: 10px 0; color: #ffffff;">${inquiry.subject || 'Website Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #94a3b8;">Date &amp; Time:</td>
            <td style="padding: 10px 0; color: #cbd5e1; font-size: 12px; font-family: monospace;">${dateFormatted} (IST)</td>
          </tr>
        </table>

        <div style="background-color: #0b1329; padding: 18px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #34d399; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">Message Body</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0;">${inquiry.message}</p>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b; font-family: monospace;">
          <span>Notification dispatched to owner: <strong>${env.OWNER_EMAIL}</strong></span>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: env.OWNER_EMAIL,
      subject,
      text: `New Inquiry from ${inquiry.name} (${inquiry.email})\nSubject: ${inquiry.subject || 'Website Message'}\nDate: ${dateFormatted}\n\nMessage:\n${inquiry.message}`,
      html,
    });
  }

  /**
   * Dispatches admin reply to visitor
   */
  async sendContactReply(
    to: string,
    recipientName: string,
    replyMessage: string,
    originalSubject?: string | null
  ): Promise<EmailDispatchResult> {
    const subject = `Re: ${originalSubject || 'Inquiry on Amit Chauhan Portfolio'}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #1e293b; border-radius: 12px; background-color: #070b16; color: #f1f5f9;">
        <div style="border-bottom: 2px solid #06b6d4; padding-bottom: 14px; margin-bottom: 18px;">
          <h3 style="color: #22d3ee; margin: 0 0 4px 0;">Hello ${recipientName},</h3>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">Thank you for getting in touch with me through my portfolio website.</p>
        </div>

        <div style="font-size: 14px; line-height: 1.7; color: #e2e8f0; margin-bottom: 24px; background-color: #0b1329; padding: 18px; border-radius: 8px; border-left: 4px solid #06b6d4;">
          <p style="white-space: pre-wrap; margin: 0;">${replyMessage}</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
        <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.5;">
          Best regards,<br>
          <strong style="color: #ffffff; font-size: 15px;">Amit Chauhan</strong><br>
          <span style="color: #38bdf8;">Software Engineer &amp; AI Developer</span><br>
          <span style="font-size: 11px; color: #64748b; font-family: monospace;">B.E. Computer Engineering</span>
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      text: replyMessage,
      html,
    });
  }

  /**
   * Dispatches secure 15-minute password reset link to administrator
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    adminName: string = 'Amit Chauhan'
  ): Promise<EmailDispatchResult> {
    const resetUrl = `${env.CORS_ORIGIN_ADMIN}/reset-password?token=${encodeURIComponent(resetToken)}`;
    const subject = `[Action Required] Reset Your Admin Password — Amit Chauhan Portfolio`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #1e293b; border-radius: 12px; background-color: #070b16; color: #f1f5f9;">
        <h2 style="color: #22d3ee; margin: 0 0 12px 0;">Admin Password Reset Request</h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Hello ${adminName},<br>
          A password reset request was initiated for your administrator account on the Portfolio CMS.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0891b2; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
            Reset Admin Password
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #38bdf8; word-break: break-all;">${resetUrl}</a>
        </p>

        <div style="background-color: #0b1329; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #eab308; margin-top: 24px;">
          <p style="margin: 0; font-size: 12px; color: #fde047;">
            <strong>Important Security Notice:</strong> This reset link will expire in <strong>15 minutes</strong> and can only be used once. If you did not make this request, your account remains secure and you may safely disregard this message.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      text: `Reset Your Admin Password:\n${resetUrl}\n\nThis link expires in 15 minutes.`,
      html,
    });
  }
}

export const emailService = new HybridEmailService();
