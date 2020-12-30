import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'; // non-relative module
import { SSR } from 'meteor/meteorhacks:ssr'; // non-relative module
// global for Meteor but you have to declare it in file to use it
/* eslint-disable no-unused-vars */
declare const Assets: any;

// use typescript to your advantage and make an interface that requires those props passed in
// utilizing the interfaces
/**
 * Email sender to distribute RadGrad newsletter. Utilizes SSR to compile and render HTML/CSS code within the email.
 * @param to The recipient.
 * @param cc The cc recipients.
 * @param from The sender.
 * @param subject The email subject line.
 * @param templateData Custom data to be rendered in the email template. SSR is used to compile and
 * render the final content.
 */
export function sendEmail({ to, bcc, from, replyTo, subject, templateData, filename }) {
  if (Meteor.isServer) {
    SSR.compileTemplate('htmlEmail', Assets.getText(`email/${filename}`));
    const html = SSR.render('htmlEmail', templateData);
    // console.log('About to send email to; ', to);
    try {
      Email.send({ to, bcc, replyTo, from, subject, html });
    } catch (e) {
      console.log('Error sending email', e);
    }
  }
}
