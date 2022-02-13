import express,{ Application} from "express"
import {createConnection} from "typeorm"
import flash from "express-flash"
import session from "express-session"
import path from "path"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import passport from "passport"
import * as dotenv from "dotenv"

import routes from './routes'


const app: Application = express()
dotenv.config({path:".env"})

//DATABASE CONNECTIONS
const main = async () => {
	try {
		await createConnection().then(() => {            
            console.log('Connection DB is successfull')
        })    

	} catch (error) {
		console.error(error);
		throw new Error('Unable to connect to db');
	}
}

main()

//EXPRESS SETTINGS
app.set("port", process.env.PORT || 5000)
app.use(express.static(path.join(__dirname, "/public")))
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "pug")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: null,
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/',routes)


//LISTENING SERVER
app.listen(app.get('port'), () => {
    console.log(`SERVER LISTENING ON ${app.get('port')}`)    
})