import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
import { User, UserRoleType } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthenticationError } from '../error/AuthenticationError'

dotenv.config()

export class PassportConfig {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly uuidService: IUuidService
  ) {
    this.initializeLocalStrategy()
    this.initializeJwtStrategy()
    this.initializeFacebookStrategy()
    this.initializeGoogleStrategy()
  }

  private initializeLocalStrategy(): void {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true,
        },
        (req, email, password, done) => {
          const errorMessage = 'Email or password is incorrect.'

          this.userRepo
            .findByEmail(email)
            .then((user) => {
              if (user == null) {
                const error = new AuthenticationError(errorMessage)
                done(error)
                return
              }

              bcrypt
                .compare(password, user.hashedPassword)
                .then((res) => {
                  if (!res) {
                    const error = new AuthenticationError(errorMessage)
                    done(error)
                    return
                  }
                  done(null, user)
                })
                .catch((err) => {
                  done(new AuthenticationError(errorMessage, err))
                })
            })
            .catch((err) => {
              done(new AuthenticationError(errorMessage, err))
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
      new JWTStrategy(jwtOptions, (jwtPayload, done) => {
        this.userRepo
          .findById(jwtPayload.id)
          .then((user) => {
            if (user !== null) {
              done(null, user)
              return
            }

            const error = new AuthenticationError(
              'Invalid token. User not found.'
            )
            done({ error }, false)
          })
          .catch((error) => {
            done({ error }, false)
          })
      })
    )
  }

  private initializeFacebookStrategy(): void {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_ID as string,
          clientSecret: process.env.FACEBOOK_SECRET as string,
          callbackURL: process.env.FACEBOOK_CALLBACK as string,
          profileFields: ['email', 'displayName'],
        },
        (accessToken, refreshToken, profile, done) => {
          const { email, displayName } = profile._json
          this.userRepo
            .findByEmail(profile._json.email)
            .then((user) => {
              if (user !== null) {
                done(null, user)
                return
              }
              if (user == null) {
                const error = new AuthenticationError(
                  'Email or password is incorrect.'
                )
                done(error)
                return
              }

              const randomPassword = Math.random().toString(36).slice(-8)
              bcrypt
                .genSalt(10)
                .then(async (salt) => await bcrypt.hash(randomPassword, salt))
                .then(async (hash) => {
                  const user = new User({
                    id: this.uuidService.generateUuid(),
                    displayName,
                    email,
                    hashedPassword: hash,
                    role: UserRoleType.PATIENT,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })

                  await this.userRepo.save(user)
                })
                .then((createdUser) => {
                  done(null, createdUser)
                })
                .catch((err) => {
                  done(err, false)
                })
            })
            .catch((err) => {
              done(err)
            })
        }
      )
    )
  }

  private initializeGoogleStrategy(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
          scope: ['profile', 'https://www.googleapis.com/auth/calendar'],
        },
        (accessToken, refreshToken, profile, done) => {
          const googleId = profile.id
          this.userRepo
            .findById(googleId)
            .then((user) => {
              if (user !== null) {
                done(null, user)
                return
              }

              if (user == null) {
                const error = new AuthenticationError(
                  'Email or password is incorrect.'
                )
                done(error)
                return
              }

              const randomPassword = Math.random().toString(36).slice(-8)
              bcrypt
                .genSalt(10)
                .then(async (salt) => await bcrypt.hash(randomPassword, salt))
                .then(async (hash) => {
                  const newUser = new User({
                    id: this.uuidService.generateUuid(),
                    email: 'jsmith@example.com',
                    displayName: 'jsmith',
                    hashedPassword: hash,
                    role: UserRoleType.PATIENT,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })

                  await this.userRepo.save(newUser)
                  done(null, newUser)
                })
                .catch((err) => {
                  done(err, false)
                })
            })
            .catch((err) => {
              done(err)
            })
        }
      )
    )
  }
}
