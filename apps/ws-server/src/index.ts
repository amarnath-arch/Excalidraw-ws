import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserManager } from "./managers/UserManager";
import { JWT_SECRET } from "@repo/common-backend/config";

const wss = new WebSocketServer({ port: 8080 });

const userManager = new UserManager();

wss.on("connection", async (socket: WebSocket, req) => {
  console.log("connected...");

  const url = req.url;
  console.log(req.url);

  if (!url) {
    socket.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  console.log("token", token);

  let userId;

  try {
    // console.log("jwtsecret is ", JWT_SECRET);
    const finalToken = token.split(" ")[1] ?? "";
    const user = jwt.verify(finalToken, JWT_SECRET);
    console.log("user found is : ", user);

    userId = (user as JwtPayload).userId;

    userManager.addUserSocket(userId, socket);

    // now receive the messsages
  } catch (err) {
    console.error(err);
    socket.close();
    return;
  }

  socket.on("close", () => {
    // remove the user from any room he has joined
    userManager.removeUser(userId, socket);
    socket.close();
  });
});
