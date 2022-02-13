import { RequestHandler } from "express"
import {Movie} from '../entity/Movie'
import {Actor} from '../entity/Actor'



//HOME PAGE
export const home:RequestHandler = async(req,res)=>{   
    
    const movies=await Movie.find({shared:true})
    const actors=await Actor.find({shared:true})
    
    res.render("home", {
        title: "Home",        
        user:req.user,
        movies,
        actors             
    })
}

//REGISTER PAGE
export const register :RequestHandler = (req,res): void => {    
    res.render("profile/_signup",{
        title: "Create Account"
    })
}

//LOGIN PAGE
export const login :RequestHandler = (req,res): void => {
    res.render("profile/_login",{
        title:"Login",        
    })
}

//ACCOUNT PAGE
export const getAccount : RequestHandler = (req,res): void => {
    res.render("profile/_profile", {
        title: "Account Management",
        user:req.user
    })
}

//ACCOUNT PAGE
export const createPost : RequestHandler = (req,res): void => {
    res.render("profile/_post_create", {
        title: "Post Management",
        user:req.user
    })
}