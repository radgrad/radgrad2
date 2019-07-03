declare const Assets: any; // global for Meteor but you have to declare it in file to use it
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'; //non-relative module
import { SSR } from 'meteor/meteorhacks:ssr'; //non-relative module

interface IEmailData {
  templateData: {
    firstName: string,
    adminMessage: string,
    recommendations: any[]
  }
}

// app/imports/typings/meteor-meteor.d.ts
// find where assests is defined as
// is it exported meteor node stubs?
/* global Assets */
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
    console.log('Are you the Meteor Server', Meteor.isServer);
    console.log('this is the filename', filename);
    SSR.compileTemplate('htmlEmail', Assets.getText(`email/${filename}`));
    const html = SSR.render('htmlEmail', templateData);
    Email.send({
      to,
      bcc,
      replyTo,
      from,
      subject,
      html
    });
  }
}
