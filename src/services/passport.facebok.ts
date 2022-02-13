const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
import {User} from '../entity/User'


passport.use(new FacebookStrategy({
    clientID: "your id",
    clientSecret: "your secret",
    callbackURL: "https://gusto-finalproject.herokuapp.com/login/facebook/callback",
    profileFields: ["id","displayName","email","name"]    
  },
  async function(accessToken,refreshToken,profile,done: Function) {  
    
    const existingUser=await User.findOne({email: profile.emails[0].value})  
  
    if(existingUser && existingUser.token!=null){      
      const user={
        id:existingUser.id,
        email:existingUser.email,
        username:existingUser.username,
        token:existingUser.token  
      }    
      done(null, user)
    }
    else{
      if(!existingUser)
      {
        const newUser =new User()
        newUser.username=profile.displayName
        newUser.email=profile.emails[0].value
        newUser.password=(profile.id).toString()
        newUser.token=accessToken           

        User.save(newUser)

        const user={
          id:newUser.id,
          email:newUser.email,
          username:newUser.username,
          token:accessToken
        }
        done(null,user)
      }
      else{        
        done(null,false)
      }     
    }    
  }
))

passport.serializeUser(function(user, done: Function) {
  done(null, user);
}) 

passport.deserializeUser(function(user, done: Function) {
  done(null, user);
})

