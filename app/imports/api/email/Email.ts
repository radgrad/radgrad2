import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'; // non-relative module
import { SSR } from 'meteor/meteorhacks:ssr'; // non-relative module
// global for Meteor but you have to declare it in file to use it
/* eslint-disable no-unused-vars */
declare const Assets: any;

// According to https://docs.meteor.com/api/email.html#Email-send
export interface sendEmailParams {
  to: string | string[];
  from: string;
  subject: string;
  templateData: any;
  filename: string;
  replyTo?: string | string[];
  bcc?: string | string[];
}

/**
 * Email sender to distribute RadGrad newsletter. Utilizes SSR to compile and render HTML/CSS code within the email.
 * @param to The recipient.
 * @param cc The cc recipients.
 * @param from The sender.
 * @param subject The email subject line.
 * @param templateData Custom data to be rendered in the email template. SSR is used to compile and
 * render the final content.
 */
export const sendEmail = ({ to, bcc = '', from, replyTo = '', subject, templateData, filename }: sendEmailParams): void => {
  if (Meteor.isServer) {
    console.log(`1. in sendEmail, filename: ${filename}, contents: ${Assets.getText(`email/${filename}`)}`);
    SSR.compileTemplate('htmlEmail', Assets.getText(`email/${filename}`));
    console.log(`2. in sendEmail, to:`);
    const html = SSR.render('htmlEmail', templateData);
    console.log(`3. in sendEmail, to:`);
    Email.send({ to, bcc, replyTo, from, subject, html });
  }
};
