import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

export abstract class EmailConfig {
  public transporter;
  public mailOptions;

  constructor(sendTo: string, title: string, text: string) {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVER,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      }
    });
    this.mailOptions = {
      from: process.env.GMAIL,
      to: sendTo,
      subject: title,
      html: text
    };
  }
}