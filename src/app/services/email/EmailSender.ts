import { config } from 'dotenv';
import { EmailConfig } from '../../../config/EmailConfig';

config();

export class EmailSender extends EmailConfig {
  constructor(sendTo: string, title: string, text: string) {
    super(sendTo, title, text);
  }  
  
  sendEmail(): void {
    this.getTransporter().sendMail(this.getMailOptions(), (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}