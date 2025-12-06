import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.config.get<string>('SERVICIO'),
      auth: {
        user: this.config.get<string>('EMAIL_USUARIO'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationCode(to: string, code: string) {
    const mailOptions = {
      from: this.config.get<string>('EMAIL_USUARIO'),
      to,
      subject: 'Código de verificación',
      html: `
        <h2>Tu código de verificación</h2>
        <p>Ingresa este código en la aplicación para verificar tu cuenta:</p>
        <div style="font-size: 32px; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>El código expira en 10 minutos.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
