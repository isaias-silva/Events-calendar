import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Responses } from 'src/enums/Responses';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async exists(filter): Promise<boolean> {
        try {
            if (!filter){
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


    async subscribe(name: string, mail: string, pass: string) {
        try {
            const exists = await this.exists({ $or: [{ name }, { mail }] })
            if (exists) {
                throw new BadRequestException(Responses.USER_ALREADY_EXISTS)
            }

            const password = bcrypt.hashSync(pass, 10)

            const user = await this.userModel.create({ name, mail, password })

            const token = await this.jwtService.signAsync({ payload: { name, mail, _id: user._id } })

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
            return { name, profile, mail, mailVerify }
        }
        catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }

    async getAllUsers() {
        try {
            const userAll = await this.userModel.find()

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
    async update(_id: string, name?: string, mail?: string, profile?: string) {
        try {
            const exists = await this.exists({ _id })
            if (!exists) {
                throw new NotFoundException(Responses.USER_NOT_FOUND)
            }
            const updatedInfo: { name?: string, mail?: string, profile?: string } = {}

            if (name) {
                updatedInfo.name = name
            }
            if (mail) {
                updatedInfo.mail = mail
            }
            if (profile) {
                updatedInfo.profile = profile
            }
            await this.userModel.updateOne({ _id }, updatedInfo)
            return { message: Responses.USER_UPDATED }

        } catch (err) {
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
}
