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

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ["./controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
router.use("/", swaggerUI.serve);
router.get("/", swaggerUI.setup(swaggerSpec));

export default router;
