import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { google } from "googleapis";
import { resolve } from "path";
const creds = require('../../../auth.client.json')

@Injectable()
export class MailService {

    makeMessage(title: string, name: string, message: string, link: string, text_link: string) {

        const mailHtml = readFileSync(resolve('public', 'assets', 'mail.html'))
        const formatMail = mailHtml.toString()
            .replace(/\[TITLE\]/g, title)
            .replace(/\[NAME\]/g, name)
            .replace(/\[MESSAGE\]/g, message)
            .replace(/\[LINK\]/g, link)
            .replace(/\[TEXT-LINK\]/g, text_link)

        return formatMail
    }
    
    createMessage(to: string, subject: string, body: string) {
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `To: ${to}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            body,
        ];

        const message = messageParts.join('\n');

        return Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    getGmail() {
        const credentials: any = creds
        const oAuth2Client = new google.auth.OAuth2(
            credentials.client_id,
            credentials.client_secret,
            credentials.redirect_uris[0]
        );


        oAuth2Client.setCredentials({
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token,
        });


        return google.gmail({ version: 'v1', auth: oAuth2Client });
    }
    async sendMail(to: string, subject: string, body: string) {
        const gmail = this.getGmail()

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: this.createMessage(to, subject, body),
            },
        });
    }
}