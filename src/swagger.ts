import express from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const router = express.Router();
/*
  Swagger Configure
*/

const swaggerDefinition = {
  info: {
    title: "Druwa API",
    version: "1.0.0",
    description: "The api docs for Druwa Server",
  },
  host: "localhost:8080",
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: ["./controllers/*", "./models/*"],
};

const swaggerSpec = swaggerJSDoc(options);
router.use("/", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// router.get("/", swaggerUI.setup(swaggerSpec));

export default router;
