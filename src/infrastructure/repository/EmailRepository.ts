import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { existsSync, readFileSync } from 'fs';
import { compile } from 'handlebars';
import { join } from 'path';
import { IEmailRepository } from '@src/domain/repository/EmailRepository';

@Injectable()
export class EmailRepository implements IEmailRepository {
  private readonly logger = new Logger(EmailRepository.name);
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private renderTemplate(templateName: string, context: Record<string, any>): string {
    const templatePath = join(process.cwd(), 'assets', 'templates', `${templateName}.hbs`);

    if (!existsSync(templatePath)) {
      throw new Error(`Template "${templateName}.hbs" no existe en assets/templates`);
    }

    const source = readFileSync(templatePath, 'utf8');
    return compile(source)(context);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = this.renderTemplate('welcome', { name });

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '¡Bienvenido a Casa de Cambio Digital!',
      html,
    });

    this.logger.log(`Welcome email sent to: ${email}`);
  }

}