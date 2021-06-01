import React, { useState } from 'react';
import { Segment, Header, Form, Button } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, NumField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { $ } from 'meteor/jquery';
import { useStickyState } from '../../../../utilities/StickyState';
import AdminAnalyticsNewsletterMessagePreviewWidget from './AdminAnalyticsNewsletterMessagePreviewWidget';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { sendEmailMethod } from '../../../../../api/email/Email.methods';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import { getRecList, getStudentEmailsByLevel, EmailData } from './utilities/newsletter';
import RadGradAlert from '../../../../utilities/RadGradAlert';

/**
 * Schema for the form that controls sending email.
 */
const schema = new SimpleSchema({
  inputMessage: String,
  bcc: { type: String, optional: true },
  subjectLine: String,
  studentEmails: { type: String, optional: true, label: 'Student Emails' },
  level: {
    type: SimpleSchema.Integer,
    allowedValues: [1, 2, 3, 4, 5, 6],
    optional: true,
    label: 'Generate and send newsletters to students of the specified level',
  },
  sendToStudentsToo: { type: Boolean, optional: true },
  sendToLevels: { type: Boolean, optional: true, label: 'Check to confirm send' },
  sendToAll: { type: Boolean, optional: true, label: 'Check to confirm send' },
});
const formSchema = new SimpleSchema2Bridge(schema);

const AdminAnalyticsNewsletterWidget: React.FC = () => {
  const [testNewsletterWorking, setTestNewsletterWorking] = useStickyState('Newsletter.test', false);
  const [levelNewsletterWorking, setLevelNewsletterWorking] = useStickyState('Newsletter.level', false);
  const [allNewsletterWorking, setAllNewsletterWorking] = useStickyState('Newsletter.all', false);
  const [subjectLine, setSubjectLine] = useState<string>('');
  const [bcc, setBcc] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [onSubmitInputMessage, setOnSubmitInputMessage] = useState<string>('');
  const [studentEmails, setStudentEmails] = useState<string>('');
  const [sendToStudentsToo, setSendToStudentsToo] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(0);
  const [sendToLevels, setSendToLevels] = useState<boolean>(false);
  const [sendToAll, setSendToAll] = useState<boolean>(false);

  const emailDelayMs = 500; // the delay between sending student emails in milliseconds.

  /** Auto Forms */
  // check on this https://stackoverflow.com/questions/38558200/react-setstate-not-updating-immediately
  const handleChange = (name, value) => {
    switch (name) {
      case 'inputMessage':
        setInputMessage(value);
        break;
      case 'onSubmitInputMessage':
        setOnSubmitInputMessage(value);
        break;
      case 'bcc':
        setBcc(value);
        break;
      case 'subjectLine':
        setSubjectLine(value);
        break;
      case 'studentEmails':
        setStudentEmails(value);
        break;
      case 'sendToStudentsToo':
        setSendToStudentsToo(value);
        break;
      case 'level':
        setLevel(parseInt(value, 10));
        break;
      case 'sendToLevels':
        setSendToLevels(value);
        break;
      case 'sendToAll':
        setSendToAll(value);
        break;
      default:
                // do nothing
    }
  };

  /**
     * Sets the Admin's message.
     */
  const onClickPreviewSave = () => {
    setOnSubmitInputMessage(inputMessage);
  };

  /**
     * Sends test emails to the admin and optionally the student(s).
     */
  const onClickSendStudentsToo = () => {
    if (onSubmitInputMessage.length !== 0 && subjectLine.length !== 0) {
      setTestNewsletterWorking(true);
      const studentEmailsArr = studentEmails.split(',');
      const bccListArray = bcc.split(',').map((email) => email.trim());
      const adminEmail = RadGradProperties.getAdminEmail();
      const from = RadGradProperties.getNewsletterFrom();
      const adminMessage = $('.adminMessage').html();
      studentEmailsArr.forEach((studentEmail) => {
        setTimeout(() => {
          const student = StudentProfiles.findByUsername(studentEmail);
          if (student) {
            const suggestedRecs = getRecList(student);
            const sendList = [];
            sendList.push(adminEmail); // always send to admin
            if (sendToStudentsToo) {
              sendList.push(studentEmail);
            }
            const emailData: EmailData = {
              to: sendList,
              bcc: bccListArray,
              from: from,
              replyTo: RadGradProperties.getAdminEmail(),
              subject: `Newsletter View For ${student.firstName} ${student.lastName}`,
              templateData: {
                adminMessage,
                firstName: student.firstName,
                firstRec: suggestedRecs[0],
                secondRec: suggestedRecs[1],
                thirdRec: suggestedRecs[2],
              },
              filename: 'newsletter2.html',
            };
            sendEmailMethod.call(emailData, (error) => {
              if (error) {
                console.error('Error sending email.', error);
              }
            });
          }
        }, emailDelayMs);
      });
      RadGradAlert.success('Emails Successfully Sent');
      setTestNewsletterWorking(false);
    } else {
      const error = 'Subject Line and Input Message Required';
      RadGradAlert.failure('Subject Line and Input Message Required', 'You forgot to fill out either the Subject Line and/or the Input Message for the Emails!', error);
    }
  };

  const onClickSendLevels = () => {
    if (onSubmitInputMessage.length !== 0 && subjectLine.length !== 0 && level !== 0) {
      setLevelNewsletterWorking(true);
      const studentEmailsArr = getStudentEmailsByLevel(level);
      const bccListArray = bcc.split(',').map((email) => email.trim());
      const from = RadGradProperties.getNewsletterFrom();
      const adminMessage = $('.adminMessage').html();
      studentEmailsArr.forEach((studentEmail) => {
        setTimeout(() => {
          const student = StudentProfiles.findByUsername(studentEmail);
          if (student) {
            const suggestedRecs = getRecList(student);
            const emailData: EmailData = {
              to: studentEmail,
              bcc: bccListArray,
              from: from,
              replyTo: RadGradProperties.getAdminEmail(),
              subject: subjectLine,
              templateData: {
                adminMessage,
                firstName: student.firstName,
                firstRec: suggestedRecs[0],
                secondRec: suggestedRecs[1],
                thirdRec: suggestedRecs[2],
              },
              filename: 'newsletter2.html',
            };
            sendEmailMethod.call(emailData, (error) => {
              if (error) {
                console.error('Error sending email.', error);
              }
            });
          }
        }, emailDelayMs);
      });
      RadGradAlert.success('Emails Successfully Sent');
      setLevelNewsletterWorking(false);
    } else {
      const error = 'Subject Line and Input Message Required';
      RadGradAlert.failure('Subject Line and Input Message Required', 'You forgot to fill out either the Subject Line and/or the Input Message for the Emails!', error);
    }
  };

  const onClickSendToAll = () => {
    if (onSubmitInputMessage.length !== 0 && subjectLine.length !== 0) {
      setAllNewsletterWorking(true);
      const profiles = StudentProfiles.find({ isAlumni: false }).fetch();
      const studentEmailsArr = profiles.map((p) => p.username);
      const bccListArray = bcc.split(',').map((email) => email.trim());
      const from = RadGradProperties.getNewsletterFrom();
      const adminMessage = $('.adminMessage').html();
      studentEmailsArr.forEach((studentEmail) => {
        setTimeout(() => {
          const student = StudentProfiles.findByUsername(studentEmail);
          if (student) {
            const suggestedRecs = getRecList(student);
            const emailData: EmailData = {
              to: studentEmail,
              bcc: bccListArray,
              from: from,
              replyTo: RadGradProperties.getAdminEmail(),
              subject: subjectLine,
              templateData: {
                adminMessage,
                firstName: student.firstName,
                firstRec: suggestedRecs[0],
                secondRec: suggestedRecs[1],
                thirdRec: suggestedRecs[2],
              },
              filename: 'newsletter2.html',
            };
            sendEmailMethod.call(emailData, (error) => {
              if (error) {
                console.error('Error sending email.', error);
              }
            });
          }
        }, emailDelayMs);
      });
      RadGradAlert.success('Emails Successfully Sent');
      setAllNewsletterWorking(false);
    } else {
      const error = 'Subject Line and Input Message Required';
      RadGradAlert.failure('Subject Line and Input Message Required', 'You forgot to fill out either the Subject Line and/or the Input Message for the Emails!', error);
    }
  };

  return (
    <Segment padded>
      <Header dividing as="h4">
                NEWSLETTER OPTIONS
      </Header>
      <AutoForm schema={formSchema} onChange={handleChange}>
        <TextField name="subjectLine"/>
        <TextField name="bcc"/>
        <Form.Group widths="equal">
          <LongTextField name="inputMessage"/>
          <AdminAnalyticsNewsletterMessagePreviewWidget message={onSubmitInputMessage}/>
        </Form.Group>
        <Button color="green" basic onClick={onClickPreviewSave}>
                    Preview And Save
        </Button>
        <Header as="h4" dividing>
                    SEND NEWSLETTER
        </Header>
        <Segment>
          <TextField name="studentEmails"/>
          <BoolField name="sendToStudentsToo"/>
          <Button basic color="green" loading={testNewsletterWorking} onClick={onClickSendStudentsToo}>
                        Send To Admin
          </Button>
        </Segment>
        <Segment>
          <NumField name="level" placeholder="level"/>
          <BoolField name="sendToLevels"/>
          <Button disabled={!sendToLevels} loading={levelNewsletterWorking} onClick={onClickSendLevels}>
                        Send To Students
          </Button>
        </Segment>
        <Segment>
          <Form.Field label="Generate To Send To All Users"/>
          <BoolField name="sendToAll"/>
          <Button disabled={!sendToAll} loading={allNewsletterWorking} onClick={onClickSendToAll}>
                        Send To All
          </Button>
        </Segment>
        <ErrorsField/>
      </AutoForm>
    </Segment>
  );
};

export default AdminAnalyticsNewsletterWidget;
