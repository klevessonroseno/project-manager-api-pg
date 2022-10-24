import 'dotenv/config';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { IEmailData } from '../app/rules/rules';

export abstract class EmailConfig {
  
  private readonly transporter: Mail<SentMessageInfo>;
  private  readonly mailOptions: IEmailData;

  constructor(sendTo: string, title: string, text: string) {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVER,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    this.mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: sendTo,
      subject: title,
      html: text
    };
  }

  getTransporter(): Mail<SentMessageInfo> {
    return this.transporter;
  }

  getMailOptions(): IEmailData {
    return this.mailOptions;
  }
}