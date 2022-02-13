import { RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

//REGISTER POST
export const postRegister: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {

    //check user inputs if they are valid or not
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);
    await check("confirmPassword", "Passwords do not match")
      .equals(req.body.password)
      .run(req);

    const errors = validationResult(req);
    //if any error occures when validation send message with flash-connect
    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/register");
    }

    //inputs data from form 
    const { username, email, password } = req.body;
    const userValid = await User.findOne({ email });

    if (userValid) {
      req.flash("errors", { msg: "Email already exist" });
      return res.redirect("/register");
    } else {
      const passwordHash = await hash(password, 10);

      const user = new User();
      user.username = username;
      user.email = email;
      user.password = passwordHash;

      //save user if everyting is OK
      await User.save(user);
      req.flash("success", { msg: "Account created.You can Login" });
      res.redirect("/");
    }
  } catch (err) {
    if (err) {
      res.send(err);
      next();
    }
  }
};

//LOGIN POST
export const postLogin: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank")
      .isLength({ min: 1 })
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/login");
    }

    const { email, password } = req.body;

    //find the user on database
    const user = await getRepository(User).findOne({ email });

    if (!user) {
      req.flash("errors", { msg: "User is not registered" });
      return res.redirect("/register");
    }
    //check password
    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      req.flash("errors", { msg: "Password is not correct" });
      return res.redirect("/login");
    }

    //this is payload for jwt sign
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: 3600,
    });

    res.cookie("jwt", token, { httpOnly: true });

    req.flash("success", { msg: "Success! You are logged in." });
    res.redirect("/login/jwt");
  } catch (err) {
    if (err) {
      res.sendStatus(404);
      next();
    }
  }
};

//LOGOUT
export const logout: RequestHandler = (req, res): void => {
  //clear the cookies and destroy the session
  res.cookie("jwt", "loggedout", { maxAge: 1 });
  req.session.destroy(() => {
    res.redirect("/");
  });
};

//UPDATE PROFIL
export const updateProfile: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    await check("username", "Username must be at least 4 characters long")
      .isLength({ min: 4 })
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/profile");
    }

    //username parameter from form input
    const { username } = req.body;
    const user_id = req.user["id"];

    if (username != null) {
      await User.update(user_id, { username });

      req.flash("success", { msg: "Profile username has been updated." });
      res.redirect("/login");
    } else {
      req.flash("error", { msg: "Username is not valid." });
    }
  } catch (err) {
    if (err) {
      res.sendStatus(404);
      next();
    }
  }
};

//UPDATE PASSWORD
export const updatePassword: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    await check("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 })
      .run(req);
    await check("confirmPassword", "Passwords do not match")
      .equals(req.body.password)
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/profile");
    }

    const { password } = req.body;
    console.log(password);
    const user_id = req.user["id"];
    const passwordHash = await hash(password, 10);
    console.log(user_id);
    console.log(passwordHash);
    await User.update(user_id, { password: passwordHash });

    req.flash("success", { msg: "Password has been updated." });
    res.redirect("/login");
  } catch (err) {
    if (err) {
      res.sendStatus(404);
      next();
    }
  }
};

//DELETE ACCOUNT
export const deleteAccount: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    //check user id from session 
    const user_id = req.user["id"];
    await User.delete(user_id);

    req.flash("success", { msg: "Account has been deleted." });

    res.cookie("jwt", "loggedout", { maxAge: 1 });
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    if (err) {
      res.sendStatus(404);
      next();
    }
  }
};
