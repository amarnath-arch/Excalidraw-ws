"use client";
import { initDraw } from "@/canvas";
import { useRef } from "react";
import { useEffect } from "react";

export default function MainCanvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      alert("here");
      const canvas = canvasRef.current;

      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} height={1000} width={1000}></canvas>;
}
