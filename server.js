const express = require("express");
const dbConnection = require("./config/database.js").connection;
const authRoute = require("./routes/auth.js");
const usersRoute = require("./routes/user.js");
const courseRoute = require("./routes/course.js");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");

require("./config/passport");
require("dotenv").config();

const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;

const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "sessions",
});

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

// Add the following middleware to enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000", "mhcdacademy.com.ng"]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/courses", courseRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day -> (1 day = 24hrs * 60mins = 1hrs * 60sec = 1mins * 1000ms = 1sec)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", (req, res) => {
  res.send("This app runs fine 😇");
});

app.listen(PORT, () => {
  dbConnection();
  console.log(`Server running at port ${PORT}`);
});
