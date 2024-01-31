import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Responses } from 'src/enums/Responses';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(JwtService) private readonly jwtService: JwtService,
        @Inject(MailService) private readonly mailService: MailService
    ) { }

    private async exists(filter): Promise<boolean> {
        try {
            if (!filter) {
                return false
            }
            const user = await this.userModel.findOne(filter)

            return user ? true : false
        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }

    async login(mail: string, password: string) {
        try {
            const user = await this.userModel.findOne({ mail })
            if (!user) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            const passwordCorrect = bcrypt.compareSync(password, user.password)
            if (!passwordCorrect) {
                throw new ForbiddenException(Responses.USER_INCORRECT_PASSWORD)
            }
            const token = await this.jwtService.signAsync({
                payload: {
                    name: user.name,
                    mail: user.mail,
                    _id: user._id
                }
            })
            return {
                token,
                message: Responses.USER_LOGIN
            }


        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }


    async subscribe(name: string, mail: string, pass: string, url?: string) {
        try {
            const exists = await this.exists({ $or: [{ name }, { mail }] })
            if (exists) {
                throw new BadRequestException(Responses.USER_ALREADY_EXISTS)
            }

            const password = bcrypt.hashSync(pass, 10)

            const code = Math.random().toString(36).replace('.0', 'Z-')

            const user = await this.userModel.create({ name, mail, password, code })

            const token = await this.jwtService.signAsync({ payload: { name, mail, _id: user._id } })


            const link = await this.generateLinkForValidate(code)

            const body = this.mailService.generateMessage('wellcome', user.name, link)

            if (body) {

                this.mailService.sendMail(user.mail, "valide seu e-mail!", body)
            }


            return { message: Responses.USER_SUBSCRIBED, token }

        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }


    async get(_id: string) {
        try {

            const user = await this.userModel.findOne({ _id })
            if (!user) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            const { name, profile, mail, mailVerify } = user

            return { name, profile, mail, mailVerify, _id }
        }
        catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }

    async getAllUsers(user: string) {
        try {
            const userAll = await this.userModel.find({ mailVerify: true, _id: { $ne: user } })

            const usersFormat = userAll.map(user => {
                const { name, profile, mail, _id } = user
                return { name, profile, mail, _id }

            })
            return usersFormat

        }
        catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async getUsersByFilter(filter) {
        try {
            if (!filter) {
                return []
            }
            const users = await this.userModel.find(filter)

            return users.map(user => {
                const { name, mail, _id, profile } = user
                return { name, mail, _id, profile }
            })
        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async update(_id: string, name?: string) {
        try {
            const exists = await this.exists({ _id })
            if (!exists) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            const updatedInfo: { name?: string } = {}

            if (name) {
                updatedInfo.name = name
            }

            await this.userModel.updateOne({ _id }, updatedInfo)
            return { message: Responses.USER_UPDATED }

        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async updateProfile(_id: string, domain: string, file: Buffer) {
        try {
            const exists = await this.exists({ _id })
            if (!exists) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            if (file) {
                const pathFile = resolve("public", "temp", _id + ".png")

                writeFileSync(pathFile, file)
                const profile = domain + `/static/${_id}.png`

                await this.userModel.updateOne({ _id }, { profile })
            }
        }
        catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async delete(_id: string) {
        try {
            const exists = await this.exists({ _id })
            if (!exists) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            await this.userModel.deleteOne({ _id })
            return { message: Responses.USER_DELETED }

        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async validateMail(_id: string, token: string) {
        try {
            const exists = await this.userModel.findOne({ _id })
            if (!exists) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            if (exists.mailVerify) {
                throw new BadRequestException(Responses.USER_ALREADY_VALIDATED)
            }
            const decoded: { code: string } = await this.jwtService.decode(token)

            if (decoded.code == exists.code) {
                await this.userModel.updateOne({ _id }, { mailVerify: true })


                const body = this.mailService.generateMessage('mail verify', exists.name)
                if (body) {

                    this.mailService.sendMail(exists.mail, "e-mail validado!", body)
                }

                return { message: Responses.USER_MAIL_VALIDATE }
            } else {
                throw new UnauthorizedException(Responses.INVALID_CODE_MAIL)
            }
        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }

    private async generateLinkForValidate(code: string) {
        const token = await this.jwtService.signAsync({ code })
        return `${process.env.FRONT}/verify?token=${token}`
    }
}

