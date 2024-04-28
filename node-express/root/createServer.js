import "dotenv";
import "../data-management/postgres-pool"; //init the DB pool as soon as possible

import express from "express";
import bodyParser from "body-parser";
import rootRouter from "./router";

//function wrapper for creating the server is mainly for
//ease of dependency injection for supertest
function createServer() {
  const app = express();

  app.use(bodyParser.json()); //for parsing the bodies of requests as JSON automatically
  app.use("/", rootRouter);

  return app;
}

export default createServer;
