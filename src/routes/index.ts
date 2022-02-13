import express from 'express'
import {home,getAccount,createPost} from '../controllers/page.controller'
import {updateProfile,updatePassword,deleteAccount} from '../controllers/auth.controller'
import {createMovie,createActor,showPosts,commentMovieByID,commentActorByID,likeMovieByID,likeActorByID,deleteMovie,deleteActor,updateMovie,updateActor} from '../controllers/post.controller'
import {isLoggedIn} from '../middileware/isLoggedIn.midleware'
import authRouter from './auth/auth';

const routes=express.Router()

routes.get('/',home)
routes.use('/',authRouter)

//User LoggedIn dashboard
routes.get('/profile',getAccount)
routes.get('/profile/createpost',isLoggedIn,createPost)
routes.get('/profile/myposts',isLoggedIn,showPosts)

//profile settings
routes.post('/profile/username',isLoggedIn,updateProfile)
routes.post('/profile/password',isLoggedIn,updatePassword)
routes.get('/profile/delete',isLoggedIn,deleteAccount)

//Create movie and actor 
routes.post('/profile/createpost/actor',isLoggedIn,createActor)
routes.post('/profile/createpost/movie',isLoggedIn,createMovie)

//Update movie and actor share status
routes.post('/profile/myposts/updatemovie/:id',updateMovie)
routes.post('/profile/myposts/updateactor/:id',updateActor)

//Delete movie and actor from database
routes.post('/profile/myposts/deletemovie/:id',deleteMovie)
routes.post('/profile/myposts/deleteactor/:id',deleteActor)

//Comment and likes routes
routes.post('/movies/comment/:id',isLoggedIn,commentMovieByID)
routes.post('/actors/comment/:id',isLoggedIn,commentActorByID)
routes.post('/movies/likes/:id',isLoggedIn,likeMovieByID)
routes.post('/actors/likes/:id',isLoggedIn,likeActorByID)


export default routes;