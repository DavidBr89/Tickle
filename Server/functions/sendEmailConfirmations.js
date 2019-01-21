'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.firestore.document('/tmp-users/{uid}').onCreate(async (snap) => {

  const val = snap.data();
  // const snapshot = change.after;
  // // const val = snapshot.val();
  //
  // if (!snapshot.changed('subscribedToMailingList')) {
  //   return null;
  // }

  const mailOptions = {
    from: '"TICKLE Corp." <noreply@firebase.com>',
    to: val.email,
  };

  const subscribed = true;//val.subscribedToMailingList;

  // Building Email message.
  mailOptions.subject = 'Thanks and Welcome!';

  mailOptions.text = 'Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.'

  try {
    await mailTransport.sendMail(mailOptions);
    console.log(`New ${subscribed ? '' : 'un'}subscription confirmation email sent to:`, val.email);
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
});
