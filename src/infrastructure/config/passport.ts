import passport from 'passport'
import { Request } from 'express'
import LocalStrategy from 'passport-local'
import FacebookStrategy from 'passport-facebook'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import { User } from '../models'
import  { getRepository }  from 'typeorm'

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async (req: Request, email: string, password: string, cb: any) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        const error = new Error('驗證失敗！');
        error.status = 401;
        return cb(error);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        const error = new Error('驗證失敗！');
        error.status = 401;
        return cb(error);
      }

      return cb(null, user);
    } catch (err) {
      cb(err);
    }
  },
));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload: any, cb: any) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(jwtPayload.id, {
      relations: ['followers', 'followings'],
    });

    if (user) {
      cb(null, user);
    } else {
      cb(new Error('User not found'));
    }
  } catch (err) {
    cb(err);
  }
}));

passport.serializeUser((user: User, cb: any) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: number, cb: any) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id, {
      relations: ['followers', 'followings'],
    });

    if (user) {
      cb(null, user);
    } else {
      cb(new Error('User not found'));
    }
  } catch (err) {
    cb(err);
  }
})





export default passport
