import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import { clientParams } from '../_consts';

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    ...clientParams,
});

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
    SES: { ses, aws },
});

// send some mail
interface SendMailParams {
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments?: { filename: string; content: Buffer }[];
}

const send = async (params: SendMailParams) => {
    return transporter.sendMail(params);
};

export const mail = {
    send,
};
