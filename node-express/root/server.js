import "../data-management/postgres-pool"; //init the DB pool as soon as possible

import express from "express";
import bodyParser from "body-parser";
import rootRouter from "./router";

const app = express();
const PORT = 8080;

app.use(bodyParser); //for parsing the bodies of requests as JSON automatically
app.use("/", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is active, listening on port ${PORT}`);
});
