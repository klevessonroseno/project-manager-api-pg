import { config } from 'dotenv';
import { EmailConfig } from '../../../config/email';

config();

export class EmailSender extends EmailConfig {
  constructor(sendTo: string, title: string, text: string) {
    super(sendTo, title, text);
  }  
  
  sendEmail(){
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}