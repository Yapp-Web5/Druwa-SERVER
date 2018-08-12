import express from "express";
import cors from "cors";
import session from "express-session";
import sessionConfig from "./configs/session";
import logger from "morgan";
import * as bodyParser from "body-parser";
import api from "./api";

const timezone = "UTC";
process.env.TZ = timezone;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(cors());

app.use("/api", api);

app.listen(8080, function() {
  console.log("Example app listening on port 8080!");
});
