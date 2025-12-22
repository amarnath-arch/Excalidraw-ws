import { WebSocket } from "ws";

export class RoomManager {
  // one mapping from userId to set < roomIds>
  private userSocketToRoomIds: Map<WebSocket, string>;

  // a single socket can be in a single room

  // a single room can have multiple sockets;
  private roomToUserSocket: Map<string, Set<WebSocket>>;

  constructor() {
    this.userSocketToRoomIds = new Map<WebSocket, string>();
    this.roomToUserSocket = new Map<string, Set<WebSocket>>();
  }

  socketInThisRoom(socket: WebSocket, roomId: string): boolean {
    if (this.roomToUserSocket.get(roomId)?.has(socket)) {
      return true;
    }

    return false;
  }

  joinRoom(socket: WebSocket, roomId: string) {
    const roomalreadyExists = this.userSocketToRoomIds.get(socket);

    if (roomalreadyExists) {
      this.userSocketToRoomIds.delete(socket); // remove the user from the room

      const oldRoom = this.roomToUserSocket.get(roomalreadyExists);

      if (oldRoom?.has(socket)) {
        oldRoom.delete(socket);
      }
    }

    const roomAlreadyHasSockets = this.roomToUserSocket.get(roomId);

    if (!roomAlreadyHasSockets) {
      this.roomToUserSocket.set(roomId, new Set<WebSocket>());
    }

    this.userSocketToRoomIds.set(socket, roomId);
    this.roomToUserSocket.get(roomId)?.add(socket);

    this.initHandler(socket);

    socket.send(
      JSON.stringify({
        type: "join_room",
        payload: {
          message: "Joined successfully",
          roomId: roomId,
        },
      })
    );
  }

  leaveRoom(socket: WebSocket, roomId: string) {
    if (!this.roomToUserSocket.get(roomId)?.has(socket)) {
      return socket.send(
        JSON.stringify({
          error: "socket is not in the room",
        })
      );
    }

    this.userSocketToRoomIds.delete(socket);
    this.roomToUserSocket.get(roomId)?.delete(socket);
  }

  getSocketsInRoom(roomId: string): Set<WebSocket> | undefined {
    if (!this.roomToUserSocket.get(roomId)) {
      return;
    }

    return this.roomToUserSocket.get(roomId);
  }

  private initHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        // if (message.type == "chat") {
        //   // paylod will have the chat and roomId
        //   const roomId = message.payload.roomId;
        //   const sentChat = message.payload.chat;

        //   this.roomToUserSocket.get(roomId)?.forEach((sckt) => {
        //     sckt.send(
        //       JSON.stringify({
        //         type: "chat",
        //         payload: {
        //           roomId: roomId,
        //           chat: sentChat,
        //         },
        //       })
        //     );
        //   });
        // } else
        if (message.type == "leave_room") {
          this.leaveRoom(socket, message.payload.roomId);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}
