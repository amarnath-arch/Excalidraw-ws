import { NextFunction, Request, Response } from "express";
import { signInSchema, signUpSchema } from "@repo/common/schema";

export default function loginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let success;

  console.log(req.body);

  if (req.url == "/signin") {
    console.log("signIn");
    const parsedBody = signInSchema.safeParse(req.body);
    success = parsedBody.success;
  } else if (req.url == "/signup") {
    console.log("signUp");

    const parsedBody = signUpSchema.safeParse(req.body);
    console.log("parsedBoy");
    console.log(parsedBody);
    success = parsedBody.success;
  } else {
    return res.status(404).json({
      error: "route not found",
    });
  }

  if (!success) {
    return res.status(411).json({
      error: "User Input Validation Failure",
    });
  }

  next();
}
