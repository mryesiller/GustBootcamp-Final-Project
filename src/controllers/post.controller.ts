import { RequestHandler } from "express";
import { Movie } from "../entity/Movie";
import { Actor } from "../entity/Actor";
import { User } from "../entity/User";

//CREATE MOVIE
export const createMovie: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user["id"];
    const username = req.user["username"];
    const { title, description, photo, shared } = req.body;

    if (!title) {
      req.flash("error", { msg: "Title cannot be empty" });
      res.redirect("/profile/createpost");
    }
    if (!description) {
      description === "No description";
    }
    //create Movie obj and assign parameters come from the form
    const movie = new Movie();
    movie.user_id = id;
    movie.title = title.toUpperCase();
    movie.description = description;
    movie.comments = [];
    movie.like = [];
    movie.creator = username;

    if (shared == "true") {
      movie.shared = true;
    } else {
      movie.shared = false;
    }
    //if there is no photo url on form assign default photo
    if (photo == "Photo-Url") {
      movie.photo =
        "https://s3.amazonaws.com/media.greatplacetowork.com/images/2018-latam/no-image-available.jpg";
    } else {
      movie.photo = photo;
    }

    await Movie.save(movie);    

    req.flash("success", { msg: "Movie created." });
    res.redirect("/profile/createpost");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      next();
    }
  }
};

//UPDATE MOVIE STATUS (SHARED)
//Movie update settings only for sharing
export const updateMovie: RequestHandler = async (req, res, next) => {
  try {
    const { button } = req.body;

    if (button == "true") {
      await Movie.update(req.params.id, { shared: false });
      req.flash("success", { msg: "Movie Unshared" });
    } else {
      await Movie.update(req.params.id, { shared: true });
      req.flash("success", { msg: "Movie Shared" });
    }

    res.redirect("/profile/myposts");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      next();
    }
  }
};

//DELETE MOVIE
export const deleteMovie: RequestHandler = async (req, res, next) => {
  try {
    await Movie.delete(req.params.id);

    req.flash("success", { msg: "Movie deleted." });
    res.redirect("/profile/myposts");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      next();
    }
  }
};

//CREATE ACTOR
export const createActor: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user["id"];
    const username = req.user["username"];
    const { firstname, lastname,description, photo, shared } = req.body;
    
    if (!description) {
      description === "No description";
    }

    const actor = new Actor();
    actor.user_id = id;
    actor.firstname = firstname.toUpperCase();
    actor.lastname = lastname.toUpperCase();
    actor.description=description
    actor.comments = [];
    actor.like = [];
    actor.creator = username;

    if (shared == "true") {
      actor.shared = true;
    } else {
      actor.shared = false;
    }
    if (photo == "Photo-Url") {
      actor.photo =
        "https://s3.amazonaws.com/media.greatplacetowork.com/images/2018-latam/no-image-available.jpg";
    } else {
      actor.photo = photo;
    }

    await Actor.save(actor);

    req.flash("success", { msg: "Actor created." });
    res.redirect("/profile/createpost");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      next();
    }
  }
};

//UPDATE ACTOR STATUS (SHARED)
export const updateActor: RequestHandler = async (req, res, next) => {
  try {
    const { button } = req.body;

    if (button == "true") {
      await Actor.update(req.params.id, { shared: false });
      req.flash("success", { msg: "Actor Unshared" });
    } else {
      await Actor.update(req.params.id, { shared: true });
      req.flash("success", { msg: "Actor Shared" });
    }

    res.redirect("/profile/myposts");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      next();
    }
  }
};

//DELETE ACTOR
export const deleteActor: RequestHandler = async (req, res, next) => {
  try {
    await Actor.delete(req.params.id);

    req.flash("success", { msg: "Actor deleted." });
    res.redirect("/profile/myposts");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      next();
    }
  }
};

//SHOW MOVIES AND ACTOR ON USERS MYPOST PAGE
export const showPosts: RequestHandler = async (req, res) => {
  const user_id = req.user["id"];

  const movies = await Movie.find({ user_id: user_id });
  const actors = await Actor.find({ user_id: user_id });

  //send database data to rendered page
  res.render("profile/_post", {
    movies,
    actors,
    user: req.user,
  });
};

//ACTOR LIKES
export const likeActorByID: RequestHandler = async (req, res) => {
  try {
    const user_id = req.user["id"];

    const actor = await Actor.findOne(req.params.id);

    //likes saving with users id on database.
    //when user hit like button database checking if user liked it before
    let total = 0;
    let check = false;
    for (let i = 0; i < actor.like.length; i++) {
      if (actor.like[i] === user_id) {
        return (check = true);
      }
      total += i;
    }

    //if there isnt user on database push the new user to databse for this instant
    if (!check) {
      actor.like.push(user_id);
    }
    await Actor.update(req.params.id, { like: actor.like });

    res.redirect("/");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      res.redirect("/");
    }
  }
};

//ACTOR COMMENTS
export const commentActorByID: RequestHandler = async (req, res) => {
  try {
    const user_id = req.user["id"];
    const comment = req.body.comment.trim();

    const actor = await Actor.findOne(req.params.id);
    const user = await User.findOne({ id: user_id });

    //comments are saved on database as a JSON object.
    //json obects dont work on mysql database. to save json object to mysql databse json objject must be JSON.stringfy and saved inside simple array.
    const obj = {
      username: user.username,
      comment: comment,
    };

    actor.comments.push(obj);
    await Actor.update(req.params.id, { comments: actor.comments });

    req.flash("success", { msg: "Comment sended." });
    res.redirect("/");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      res.redirect("/");
    }
  }
};

//MOVIE LIKES
export const likeMovieByID: RequestHandler = async (req, res) => {
  try {
    const user_id = req.user["id"];

    const movie = await Movie.findOne(req.params.id);

    let total = 0;
    let check = false;
    for (let i = 0; i < movie.like.length; i++) {
      if (movie.like[i] === user_id) {
        return (check = true);
      }
      total += i;
    }

    if (!check) {
      movie.like.push(user_id);
    }

    await Movie.update(req.params.id, { like: movie.like });
    
    res.redirect("/");
  } catch (err) {
    req.flash("error", { msg: err });
    res.redirect("/");
  }
};

//MOVIE COMMENTS
export const commentMovieByID: RequestHandler = async (req, res) => {
  try {
    const user_id = req.user["id"];
    const comment = req.body.comment.trim();

    const movie = await Movie.findOne(req.params.id);
    const user = await User.findOne({ id: user_id });

    const obj = {
      username: user.username,
      comment: comment,
    };

    movie.comments.push(obj);
    await Movie.update(req.params.id, { comments: movie.comments });

    req.flash("success", { msg: "Comment sended." });
    res.redirect("/");
  } catch (err) {
    if (err) {
      req.flash("error", { msg: err });
      res.redirect("/");
    }
  }
};
