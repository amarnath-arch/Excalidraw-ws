import { Router } from "express";
import express from "express";
import userRouter from "./user.route";

const rootRouter: Router = express.Router();

rootRouter.use("/user", userRouter);

export default rootRouter;
