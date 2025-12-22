import express, { Router } from "express";
import db from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
import loginValidation from "../auth/loginValidation";
import userAuth from "../auth/userAuth";

const userRouter: Router = express.Router();

userRouter.post("/signup", loginValidation, async (req, res) => {
  // get the body
  const { email, password, name } = req.body;

  // check if the user already exits or not
  let foundUser;

  try {
    foundUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (foundUser) {
      return res.status(404).json({
        error: "User already exists",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "server error",
    });
  }

  // hash the password and store it
  const hashedPassword = await bcrypt.hash(password, 10);

  // const token = jwt.sign({
  //   userId:
  // })

  try {
    // create the user in the db
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      message: "successfully signed up",
      userId: newUser.id,
      token: `Bearer ${token}`,
    });
  } catch (err) {
    return res.status(500).json({
      error: "server error",
    });
  }
});

userRouter.post("/signin", loginValidation, async (req, res) => {
  // get the body
  const { email, password } = req.body;

  // check if the user already exists or not
  let foundUser;

  try {
    foundUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!foundUser) {
      return res.status(404).json({
        error: "User does not exist",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "server error",
    });
  }

  // compare the passwords
  const matchedPassword = await bcrypt.compare(password, foundUser.password);

  if (!matchedPassword) {
    return res.status(411).json({
      error: "user authentication failed",
    });
  }

  try {
    // console.log("jwtsecret is ", JWT_SECRET);

    const token = jwt.sign(
      {
        userId: foundUser.id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      message: "successfully signed in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      error: "server error",
    });
  }
});

userRouter.post("/room", userAuth, async (req, res) => {
  const { slug } = req.body;

  try {
    const room = await db.room.create({
      data: {
        slug: slug ?? "",
        adminId: req.userId ?? "",
      },
    });

    return res.status(200).json({
      roomId: room.id,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
});

userRouter.get("/chat/:roomId", userAuth, async (req, res) => {
  try {
    const roomId = req.params.roomId;

    if (!roomId) {
      return res.status(411).json({
        error: "Room Id not provided",
      });
    }

    const chats = await db.chat.findMany({
      where: {
        roomId: Number(roomId),
      },
      orderBy: {
        id: "desc",
      },
      take: 20,
    });

    return res.status(200).json({
      chats: chats,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

export default userRouter;
