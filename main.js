// const db = require("./queries"); ???
const express = require("express");
const exphbs = require("express-handlebars");
// const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const app = express();
const crypto = require("crypto");

// NOWE
const pool = require("./queries");

// const url = require("url");
// const querystring = require("querystring");

// NOWE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(bodyParser.json());
// // To support URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));

const authTokens = {};

// To parse cookies from the HTTP Request
app.use(cookieParser());

app.use((req, _, next) => {
  const authToken = req.cookies["AuthToken"];
  req.user = authTokens[authToken];
  next();
});

// const data = [];

const users = [
  // This user is added to the array to avoid creating a new user on each restart
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    // This is the SHA256 hash for value of `password`
    password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
  },
];

// const { request } = require("http");
// const { response } = require("express");
// const { Pool } = require("pg");

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

// GET + POST REQUESTS

app.get("/", function (_, res) {
  res.render("home");
});

app.get("/register", (_, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.render("register", {
      message: "Passwords does not match",
      messageClass: "alert-danger",
    });
  }

  if (
    users.find((u) => u.email.toLocaleLowerCase() === email.toLocaleLowerCase())
  ) {
    res.render("register", {
      message: "User is in base",
      messageClass: "alert-success",
    });
  }

  users.push({
    firstName,
    lastName,
    email,
    password: getHashedPassword(password),
  });

  res.render("login", {
    message: "Correct register!",
    messageClass: "alert-success",
  });
});

app.get("/login", (_, res) => {
  res.render("login");
});
// Our requests hadlers will be implemented here...

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  const user = users.find((u) => {
    return (
      u.email.toLocaleLowerCase() === email.toLocaleLowerCase() &&
      u.password === hashedPassword
    );
  });
  if (!user) {
    res.render("login", {
      message: "Invalid username or password",
      messageClass: "alert-danger",
    });
  }
  const authToken = generateAuthToken();

  // Store authentication token
  authTokens[authToken] = user;

  // Setting the auth token in cookies
  res.cookie("AuthToken", authToken);

  // Redirect user to the protected page
  res.redirect("/protected");
});

app.get("/protected", (req, res) => {
  if (req.user) {
    res.render("protected", {
      schedules1: {
        id: "2",
        user_Id: "2",
        day: "3",
        timeStart: "12",
        timeEnd: "14",
      },
      schedules2: {
        id: "3",
        user_Id: "4",
        day: "5",
        timeStart: "13",
        timeEnd: "15",
      },
      users: {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@email.com",
        // This is the SHA256 hash for value of `password`
        password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
      },
    });
  } else {
    res.render("login", {
      message: "Bad login or password",
      messageClass: "alert-danger",
    });
  }
});

// app.get("/forms", (req, res) => {
//   return res.render("protected");
// });

// app.get("/forms", (req, res) => {
//   return res.render("protected2");
// });

// app.get("/add", (req, res) => {
//   res.send(
//     req.query.Id +
//       " " +
//       req.query.Day +
//       " " +
//       req.query.TimeStart +
//       " " +
//       req.query.TimeEnd
//   );
// });

// app.post("/add", (req, res) => {
//   res.send(
//     req.query.Id +
//       " " +
//       req.query.Day +
//       " " +
//       req.query.TimeStart +
//       " " +
//       req.query.TimeEnd
//   );
// });

// app.get("/get", db.getSchedules); // dane użytkowników

app.get("/schedules", (req, res) => {
  res.render("protected");
});

app.post("/post", async (req, res) => {
  // console.log(req.body)
  try {
    const { user_id, day, timeStart, timeEnd } = req.body;
    await pool.query(
      `INSERT INTO schedules (user_id, day, timeStart, timeEnd) VALUES($1, $2, $3, $4) RETURNING *`,
      [user_id, day, timeStart, timeEnd]
    );
    res.render("protected");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/add-post", (req, res) => {
  res.render("protected2");
});

app.listen(3000);
