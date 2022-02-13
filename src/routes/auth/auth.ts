import express from 'express'
import {postRegister,postLogin,logout} from '../../controllers/auth.controller'
import {login,register} from '../../controllers/page.controller'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import '../../services/passport.google'
import '../../services/passport.jwt'
import '../../services/passport.facebok'

const router=express.Router({mergeParams:true})

//Login auth routes
router.route('/login')
    .get(login)
    .post(postLogin)

//Register auth routes    
router.route('/register')
    .get(register)
    .post(postRegister)

//Logout routes    
router.route('/logout')
    .get(logout)    

//Passport google-facebook and jwt auth checks and callbacks routes
router.get('/login/jwt',passport.authenticate('jwt',{successRedirect:'/',failureRedirect:'/login'}))  
router.get('/login/google',passport.authenticate('google',{scope:['email','profile']}))
router.get('/login/google/callback',passport.authenticate('google',{    
    failureRedirect:'/login',
    failureMessage: true
}),async(req,res)=>{
    const payload={
        email:req.user['email']
    }
    const token= await jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 });        
    res.cookie("jwt", token, { httpOnly: true })
    res.redirect('/')
})

router.get('/login/facebook',passport.authenticate('facebook',{scope: 'email'}))
router.get('/login/facebook/callback',passport.authenticate('facebook',{    
    failureRedirect:'/login',
    failureMessage: true
}),async(req,res)=>{    
    const payload={
        email:req.user['email']
    }
    const token= await jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 });        
    res.cookie("jwt", token, { httpOnly: true })
    res.redirect('/')
})    


const authRouter = router;
export default authRouter;



