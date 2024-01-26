import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { google } from "googleapis";
import { resolve } from "path";
import { EventDocument } from "src/schemas/event.schema";
const creds = require('../../../auth.client.json')

@Injectable()
export class MailService {

    generateMessage(type: 'wellcome' | 'mail verify' | 'invite user' | 'invite owner' | 'cancel event' | 'invite approve' | 'invite guest' | 'invite guest approve' | 'event is today',
        userName: string,
        link?: string,
        event?: EventDocument,
        secondUserName?: string) {

        let body

        switch (type) {
            case 'wellcome':
                body = this.makeMessage(
                    `seja bem vindo`,
                    userName,
                    `seja bem vindo a events callendar! para validar o e-mail da sua conta clique no link abaixo: `,
                    link,
                    'validar e-mail',
                    "https://picsmemes.com/wp-content/uploads/2022/10/welcome-to-the-club-meme.jpg")

                break

            case 'mail verify':
                body = this.makeMessage(
                    `Seu e-mail foi validado!`,
                    userName,
                    `seu e-mail foi validado com sucesso! você já pode programar seus eventos e se inscrever em eventos com maestria na nossa plataforma!`,
                    process.env.FRONT,
                    'acesse seu dashboard',
                    "https://i.pinimg.com/originals/55/62/45/556245f7b539f2645da5e4d0d59f42e5.jpg")

                break
            case 'invite user':
                body = this.makeMessage(event.isPrivate ? "solicitação enviada" : "confirmação de participação",
                    userName,
                    `sua ${event.isPrivate ? "solicitação de inscrição" : "inscrição"} foi enviada para o evento: "${event.title}".
                    ${event.isPrivate ? "aguarde a aprovação, do organizador do evento para poder participar. " : "você já está na lista de participantes"}
                    clique no link abaixo para acessar a página do evento.`,
                    link,
                    "acessar página do evento",
                    "https://cdn-icons-png.flaticon.com/512/6213/6213185.png")

                break
            case 'invite owner':
                body = this.makeMessage(event.isPrivate ? "pedido de participação!" : "inscrição de participante",
                    userName,
                    `houve uma nova ${event.isPrivate ? "solicitação de participação" : ""} inscrição no seu evento: "${event.title}".
                clique abaixo para acessar a página do evento.`,
                    link,
                    "acessar página do seu evento",
                    "https://cdn-icons-png.flaticon.com/512/6213/6213185.png")
                break

            case 'invite approve':

                body = this.makeMessage(`Parabéns`,
                    userName,
                    `sua inscrição no evento "${event.title}" foi aprovada pelo organizador do evento, fique atento as datas para não perder!`,
                    link,
                    "acesse o evento na plataforma",
                    "https://i.pinimg.com/474x/b4/8b/0a/b48b0a592f9b3a9f076e16a637627003.jpg")
                break

            case 'cancel event':
                body = this.makeMessage(`Evento cancelado`,
                    userName,
                    `o evento "${event.title}" foi cancelado pelo organizador do evento, aguarde o surgimento de novos eventos para participar.`,
                    process.env.FRONT,
                    "acesse a plataforma",
                    "https://i.pinimg.com/originals/1b/c4/5b/1bc45b0143e71af4a6791f79b5bb0762.jpg")
                break

            case 'invite guest':
                body = this.makeMessage(`novo convite para participação!`,
                    userName,
                    `você foi convidado pelo organizador para o evento "${event.title}" acesse a plataforma para aceitar o convite e confirmar sua participação!`,
                    link,
                    "acesse a página do evento",
                    "https://i.makeagif.com/media/2-28-2015/HYjOCA.gif")
                break
            case 'invite guest approve':
                body = this.makeMessage(`convite aceito!`,
                    userName,
                    `o usuário ${secondUserName} acabou de aceitar seu convite para o evento "${event.title}", 
                acesse a página do evento para ver todos os participantes do seu evento! `,
                    link,
                    "acessar página do evento",
                    "https://i.makeagif.com/media/2-28-2015/HYjOCA.gif")
                break

            case "event is today":
                body = this.makeMessage(`É HOJE!`,
                    userName,
                    `O evento "${event.title}" ao qual você é inscrito ocorrerá hoje! 
                    lembre-se de não se atrasar para comparecer! clique no link abaixo para acessar a página do evento!`,
                    link,
                    "acessar página do evento",
                    "https://i.makeagif.com/media/2-28-2015/HYjOCA.gif")
                break
              
            default:
                return null

        }

        return body





    }

    private makeMessage(title: string, name: string, message: string, link: string, text_link: string, image_url: string) {

        const mailHtml = readFileSync(resolve('public', 'assets', 'mail.html'))
        const formatMail = mailHtml.toString()
            .replace(/\[TITLE\]/g, title)
            .replace(/\[NAME\]/g, name)
            .replace(/\[MESSAGE\]/g, message)
            .replace(/\[LINK\]/g, link)
            .replace(/\[TEXT-LINK\]/g, text_link)
            .replace(/\[IMAGE]/g, image_url)

        return formatMail
    }

    private createMessage(to: string, subject: string, body: string) {
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

    private getGmail() {
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