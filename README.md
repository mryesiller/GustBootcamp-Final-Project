<h1 align="center">⚡ Gusto&RemoteTeam Bootcamp Final Project ⚡</h1>

![Gusto](/image/gusto.png)

<p>This is a simple movie and actor sharing webproject built on nodejs</p>

<h2 align="center">🔥 Project Details 🔥</h2>

* User login-register authentication with google and facebook signup
* Users can change username and password on profile page
* Users can delete account on profile page
* Users can create favorite Movie and favorite Actor on Create Post page
* Users can share favorite Movie and favorite Actor on My Posts page
* Users can delete and change status of share favorite Movies and favorite Actors on My Posts page
* Users can send comment and like favorite Movies and favorite Actors created by other users on Dashboard when login

<h2 align="center">🔥 Technologies 🔥</h2>

* Backend : NodeJs with ts-node and typescript
* Frontend : Pug engine template 
* Typeorm with MySql and Postgres Database (2 connections)
* MVC architecture

## Installation

Clone the project to your local repository
```javascript
git clone https://github.com/Kodluyoruz-NodeJs-Bootcamp/final-project

```
Install the dependencies of the project

```
npm install
```
Change  .env file in the project's directory. Environment variables inside your .env file should look like this

```
SESSION_SECRET=<enter an arbitrary string here>
JWT_SECRET=<enter an arbitrary string here>
PORT=<enter your port number here>
```

Change  .ormconfig.json file in the project's directory. These variables connection settings to Postgres on your computer.

 ```
   "type": "mysql", or "postgres"
   "host": "localhost",
   "port": 5432,
   "username": <your username>, 
   "password": <your password>,
   "database": <your database name>

```

# Project images 

![HomePage](/image/home.png)

![LoginPage](/image/login.png)

![SignupPage](/image/gusto_signup.png)

![DashboardPage](/image/dashboard.png)

![ProfilePage](/image/profile.png)

![UsersPosts](/image/mypost.png)

![UsersCreatePosts](/image/createpost.png)

