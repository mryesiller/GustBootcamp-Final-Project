import { RequestHandler } from 'express';


//* Redirect to homepage if a logged in user tries to login or register
export const isLoggedIn : RequestHandler =  (req, res, next) => {

  req.user ? next() : res.redirect('/login');  

}

