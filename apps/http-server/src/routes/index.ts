import { Router } from "express";
import express from "express";
import userRouter from "./user.route";
import userAuth from "../auth/userAuth";

const rootRouter: Router = express.Router();

rootRouter.get("/hellothere", userAuth, (req, res) => {
  console.log("hello there");
  return res.status(200).json({
    message: "hello there",
    id: req.userId,
  });
});

rootRouter.use("/user", userRouter);

export default rootRouter;
