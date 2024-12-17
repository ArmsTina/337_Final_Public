const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Passport Library for session features
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// env
require("dotenv").config();

// Method Override for PUT and DELETE requests
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// body-parser to use req.body
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = process.env.DBURL;

mongoose
  .connect(url)
  .then(() => console.log("Connected to DB"))
  .catch((e) => {
    console.log("Error while connecting to DB\n" + e);
  });

// Schema for 'users' collection
const UserSchema = new Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  gameState: {
    type: Array,
  },
  score: {
    type: Number,
  },
  word: {
    type: String,
  },
});
// Schema for 'rankings' collection
const RankingSchema = new mongoose.Schema({
  username: String,
  score: Number,
});
const Ranking = mongoose.model("Ranking", RankingSchema);
const User = mongoose.model("users", UserSchema);
const dynamicSchema = new mongoose.Schema({}, { strict: false });
const lib = mongoose.model("lib", dynamicSchema, "wordleLibrary");

app.use(express.static(path.join(__dirname, "/build")));

// Login Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // Limit session time to 1 hour
  })
);
app.use(passport.initialize());
app.use(passport.session());

// This will be called when passport.authenticate("local")(req, res, next)
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid username or password" });
        }
      } catch (err) {
        console.log("Error during authentication.");
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username });
  });
});

passport.deserializeUser(async (user, done) => {
  try {
    const fullUser = await User.findById(user.id);
    delete fullUser.password; // delete password from the user object
    done(null, fullUser);
  } catch (err) {
    done(err);
  }
});

// Middleware to check if the user is logged in
function checkLogin(req, res, next) {
  // If user is not logged in, redirect to login page
  if (!req.user) {
    return res.redirect("/");
  }
  next();
}

// Handles POST request for creating an account
app.post("/create-account", async (req, res) => {
  let guess = (await lib.find({}))[0].words[Math.floor(Math.random() * 2315)];
  let hash = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    gameState: new Array(30),
    score: 0,
    word: guess,
  });
  try {
    await newUser.save();
    // Send a success response if the account is created successfully
    res
      .status(200)
      .json({ success: true, message: `Welcome, ${newUser.username}!` });
  } catch (e) {
    // Send a failure response if there is an error (e.g., duplicate username or email)
    res.json({
      success: false,
      message:
        "This username or email is already in our database. Please try a different username or email.",
    });
  }
});

app.post("/update/user/wordle", async (req, res) => {
  try {
    let { user, wordleGrid, victory } = req.body;
    const doc = await User.findOne({ username: user });
    if (victory != 0) {
      doc.gameState = new Array(30);
      doc.score += 1;
      wordleLibrary = await lib.find({});
      let newWord = wordleLibrary[0].words[Math.floor(Math.random() * 2315)];
      while (newWord == doc.word) {
        doc.word = newWord;
        newWord = wordleLib[Math.floor(Math.random() * 2315)];
      }
      doc.word = newWord;
    } else {
      doc.gameState = wordleGrid;
    }
    await doc.save();
    console.log(doc);
    res.status(200).json({ info: doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Update the ranking collection with the top 10 users
app.put("/update-ranking", async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ score: -1 })
      .limit(10)
      .select("username score");

    await Ranking.deleteMany({});

    const rankingData = topUsers.map((user) => ({
      username: user.username,
      score: user.score,
    }));

    await Ranking.insertMany(rankingData);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error updating ranking");
    res.sendStatus(500);
  }
});

app.post("/board", async (req, res) => {
  User.findOne({ username: req.body.user })
    .then((doc) => {
      res.statusCode = 200;
      res.json({ info: doc });
    })
    .catch((err) => {
      res.statusCode = 200;
      res.json({ error: err });
    });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.get("/help", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

// Handles POST request for logging in
app.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server error during login" });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.json({ success: true, message: `Welcome, ${user.username}!` });
    });
  })(req, res, next);
});

app.use(checkLogin);

app.post("/check-login-status", (req, res) => {
  console.log(req.user);
  if (req.user) {
    console.log("logged in");
    res.status(200).json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Handles POST request for logging out
app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// For a leaderboard, get a username and score of the top 10 users
app.post("/leaderboard", async (req, res) => {
  try {
    const top10 = await Ranking.find({}).sort({ score: -1 }).limit(10);
    res.status(200).json(top10);
  } catch (err) {
    console.error("Error fetching leaderboard");
    res.status(500);
  }
});

// Get the username and email of the logged-in user
app.post("/account-settings", (req, res) => {
  res.json({ username: req.user.username, email: req.user.email });
});

// Update the user's password
app.put("/account-settings", async (req, res) => {
  let user = await User.findById(req.user._id);
  let match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    let hash = await bcrypt.hash(req.body.newPassword, 10);
    user.password = hash;
    await user.save();
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Redirect all unhandled routes to the React app, allowing React Router to manage routing on the client side
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(5000, () => {
  console.log("listening on 5000");
});
