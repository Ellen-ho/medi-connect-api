import passport, { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
// import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import jwt from 'jsonwebtoken'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'

export class Passport {
  private readonly JWT_SECRET: string
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashgenerator: IHashGenerator,
    private readonly jwtSecret: string
  ) {
    this.JWT_SECRET = this.jwtSecret
  }

  public init(): PassportStatic {
    return passport.use(
      new LocalStrategy((email, password, done) => {
        this.userRepository
          .findByEmail(email)
          .then(async (user) => {
            if (user == null) {
              done(null, false, { message: 'Incorrect email.' })
              return
            }

            const isPasswordValid = await this.hashgenerator.compare(
              password,
              user.hashedPassword
            )
            if (!isPasswordValid) {
              done(null, false, { message: 'Incorrect password.' })
              return
            }
            // Generate a JWT token
            const payload = { id: user.id, email: user.email }
            const token = jwt.sign(payload, this.JWT_SECRET, {
              expiresIn: '1h',
            })

            done(null, { token })
          })
          .catch((err) => {
            done(err)
          })
      })
    )
  }
}

// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET,
// }

// passport.use(
//   new JWTStrategy(jwtOptions, async (jwtPayload: any, cb: any) => {
//     try {
//       const userRepository = getRepository(User)
//       const user = await userRepository.findOne(jwtPayload.id, {
//         relations: ['followers', 'followings'],
//       })

//       if (user) {
//         cb(null, user)
//       } else {
//         cb(new Error('User not found'))
//       }
//     } catch (err) {
//       cb(err)
//     }
//   })
// )

// passport.serializeUser((user: User, cb: any) => {
//   cb(null, user.id)
// })

// passport.deserializeUser(async (id: number, cb: any) => {
//   try {
//     const userRepository = getRepository(User)
//     const user = await userRepository.findOne(id, {
//       relations: ['followers', 'followings'],
//     })

//     if (user) {
//       cb(null, user)
//     } else {
//       cb(new Error('User not found'))
//     }
//   } catch (err) {
//     cb(err)
//   }
// })
