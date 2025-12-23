"use client";
import { initDraw } from "@/canvas";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import MainCanvas from "./MainCanvas";

export default function ChildCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    alert(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=${localStorage.getItem("token")}`
    );

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "join_room",
          payload: {
            roomId: roomId,
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!socket) {
    return <div>.... Connecting to the board</div>;
  }

  return <MainCanvas roomId={roomId} socket={socket} />;
}
