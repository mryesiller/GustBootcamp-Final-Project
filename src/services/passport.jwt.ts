import passport from "passport"
import { Strategy,VerifyCallback,StrategyOptions } from "passport-jwt"
import { User } from "../entity/User"
import * as dotenv from "dotenv"
dotenv.config({ path: ".env" })

var cookieExtractor = () =>
  function (req) {
    var token = null
    if (req && req.cookies) {
      token = req.cookies["jwt"]
    }
    
    return token;
  }

const SECRET_KEY = process.env.SECRET_KEY;
const options:StrategyOptions = {
  jwtFromRequest: cookieExtractor(),
  secretOrKey: SECRET_KEY
     
}
const verifycallback:VerifyCallback= async(payload, done)=>{
  
  const user = await User.findOne({
    email: payload.email
  })

  //user object on passport session
  const userObj={
    id:user.id,
    username:user.username,
    email:user.email     
  }

  if (user) {    
    done(null, userObj);
  } else {
    done(null, false);
  }
}

passport.use(new Strategy(options,verifycallback))

passport.serializeUser(function (user, done: Function) {
  done(null, user);
})

passport.deserializeUser(function (user, done: Function) {
  done(null, user);
})
