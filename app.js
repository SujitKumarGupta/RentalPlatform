// Loading environment variables in non-production environments
if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express(); // Initialize Express app

// Serve static files for chatbot
app.use('/chatbot', express.static(path.join(__dirname, 'views', 'listing', 'Chatbot')));

// Import routers
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const chatbotRouter = require('./routes/chatbot'); // Added Chatbot Router

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
const dbUrl = process.env.ATLASDB_URL; 

const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto:{
      secret:process.env.SECRET,
   },
   touchAfter: 24 * 3600, // time period in seconds
 
});
store.on("error",()=>{
   console.log("ERROR in Mongo SESSION STORE",err);
});
// Session configuration
const sessionOption = {
   store,
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
       expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
       maxAge: 7 * 24 * 60 * 60 * 1000,
       httpOnly: true
   }
};


// Middleware for session, flash, and passport
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport.js setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB Connection
 // Make sure this is in your .env file
main()
   .then(() => {
      console.log("✅ Connected to MongoDB Atlas");
   })
   .catch((err) => {
      console.log("❌ MongoDB Connection Error:", err);
});

// MongoDB connection function
async function main() {
   await mongoose.connect(dbUrl);
}

// Middleware to set flash messages and current user in locals
app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   res.locals.Error = req.flash("Error");
   res.locals.curuser = req.user;
   next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", chatbotRouter); // Added Chatbot Router



// 404 Error handling route
app.all("*", (req, res, next) => {
   next(new Error("Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
   const { status = 500, message = "Something went wrong!" } = err;
   res.status(status).render("listing/error.ejs", { message });
});

// Start server
app.listen(3000, () => {
   console.log("🚀 Listening on port 3000");
});
