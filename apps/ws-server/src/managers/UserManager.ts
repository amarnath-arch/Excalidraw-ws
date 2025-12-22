import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";

export class UserManager {
  // userid, room id , socket id

  // one user can connect to multiple rooms

  // one mapping from userId to set < roomIds>
  //   private userIdToRoomIds: Map<string, Set<String>>;
  // one mappign from user Id to websocket id current
  private userIdToWebSockets: Map<string, Set<WebSocket>>;
  private socketToUserId: Map<WebSocket, string>;
  private roomManager: RoomManager;
  //get the user websocket connection

  constructor() {
    // this.userIdToRoomIds = new Map<string, Set<string>>();
    this.userIdToWebSockets = new Map<string, Set<WebSocket>>();
    this.socketToUserId = new Map<WebSocket, string>();

    this.roomManager = new RoomManager();
  }

  private addUser(userId: string, socket: WebSocket) {
    if (this.userIdToWebSockets.get(userId)) {
      return;
    }

    this.userIdToWebSockets.set(userId, new Set<WebSocket>());
    this.userIdToWebSockets.get(userId)?.add(socket);
    this.socketToUserId.set(socket, userId);
    this.initHandler(socket);
  }

  addUserSocket(userId: string, socket: WebSocket) {
    if (!this.userIdToWebSockets.get(userId)) {
      this.addUser(userId, socket);
      return;
    }
    this.userIdToWebSockets.get(userId)?.add(socket);
    this.socketToUserId.set(socket, userId);
    this.initHandler(socket);
  }

  getUserIdFromSocket(socket: WebSocket) {
    return this.socketToUserId.get(socket);
  }

  //   updateUserSocket(userId: string, socket: WebSocket) {
  //     this.userIdToWebSocket.set(userId, socket);
  //   }

  //   getUserSocket(userId: string) {
  //     this.userIdToWebSocket.get(userId);
  //   }

  removeUser(userId: string, socket: WebSocket) {
    if (!this.userIdToWebSockets.get(userId)?.has(socket)) {
      return socket.send(
        JSON.stringify({
          error: "error removing the user",
        })
      );
    }

    // make the socket leave the room TODO:

    // remove the socket from user Id
    this.userIdToWebSockets.get(userId)?.delete(socket);
    this.socketToUserId.delete(socket);
  }

  private initHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type == "join_room") {
        // join_room : payload -> roomId
        if (!message.payload.roomId) {
          return socket.send(
            JSON.stringify({
              error: "Input Error",
            })
          );
        }

        // get the userid from the socket
        const userId = this.getUserIdFromSocket(socket);

        if (!userId) {
          return socket.send(
            JSON.stringify({
              error: "Error fetching userId",
            })
          );
        }

        const someOtherSocketFoundInTheSameRoom = [
          ...(this.userIdToWebSockets.get(userId) ?? []),
        ].find((sckt) => sckt != socket && this.roomManager.socketInThisRoom);

        if (someOtherSocketFoundInTheSameRoom) {
          return socket.send(
            JSON.stringify({
              error: "User already in the same room",
            })
          );
        }

        // TODO: // check if tthis room exists or not

        this.roomManager.joinRoom(socket, message.payload.roomId);
      } else if (message.type == "chat") {
        // paylod will have the chat and roomId
        const roomId = message.payload.roomId;
        const sentChat = message.payload.chat;

        // check socket is part of this room or not
        const partOfThisRoom = this.roomManager.socketInThisRoom(
          socket,
          roomId
        );

        if (!partOfThisRoom) {
          return socket.send(
            JSON.stringify({
              error: "Not part of this room unfortunately",
            })
          );
        }

        const allSocketsInRoom = this.roomManager.getSocketsInRoom(roomId);

        if (!allSocketsInRoom) {
          return socket.send(
            JSON.stringify({
              error: "room is empty",
            })
          );
        }

        allSocketsInRoom.forEach((sckt) => {
          sckt.send(
            JSON.stringify({
              type: "chat",
              payload: {
                from: this.getUserIdFromSocket(socket),
                to: this.getUserIdFromSocket(sckt),
                roomId: roomId,
                chat: sentChat,
              },
            })
          );
        });
      }
    });
  }
}
