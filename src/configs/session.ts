import session from "express-session";
const sessionConfig: session.SessionOptions = {
  secret: "123!@#",
  resave: false,
  saveUninitialized: true
};

export default sessionConfig;
