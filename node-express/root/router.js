import express from "express";

import usersRouter from "../src/users/routes/routes";
import thirdPartiesRouter from "../src/third-parties/routes/routes";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/third-parties", thirdPartiesRouter);

export default router;
