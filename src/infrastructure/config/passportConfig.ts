import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'

dotenv.config()

export class PassportConfig {
  constructor(private readonly userRepo: IUserRepository) {
    this.initializeLocalStrategy()
    this.initializeJwtStrategy()
  }

  private initializeLocalStrategy(): void {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true,
        },
        (req, email, password, cb) => {
          this.userRepo
            .findByEmail(email)
            .then((user) => {
              if (user == null) {
                const error = new Error('驗證失敗！')
                cb(error)
                return
              }

              bcrypt
                .compare(password, user.hashedPassword)
                .then((res) => {
                  if (!res) {
                    const error = new Error('驗證失敗！')
                    cb(error)
                    return
                  }
                  cb(null, user)
                })
                .catch((err) => {
                  cb(err)
                })
            })
            .catch((err) => {
              cb(err)
            })
        }
      )
    )
  }

  private initializeJwtStrategy(): void {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    }
    passport.use(
      new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
        this.userRepo
          .findById(jwtPayload.id)
          .then((user) => {
            if (user !== null) {
              cb(null, user)
            }

            const error = new Error('Extract JWT Error')
            cb(error)
          })
          .catch((err) => {
            cb(err)
          })
      })
    )
  }
}
