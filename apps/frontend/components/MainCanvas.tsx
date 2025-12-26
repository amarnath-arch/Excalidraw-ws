"use client";
import { initDraw } from "@/canvas";
import { useRef, useState } from "react";
import { useEffect } from "react";
import ToolsBar from "./ToolsBar";
import { Tool } from "@/canvas/types";
import { Draw } from "@/canvas/draw";

export default function MainCanvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<Draw>();

  const [selectedTool, setSelectedTool] = useState<Tool>("rect");

  useEffect(() => {
    if (drawing) {
      drawing.setSelectedTool(selectedTool);
    }
  }, [selectedTool, drawing]);

  useEffect(() => {
    if (canvasRef.current) {
      alert("here");
      const canvas = canvasRef.current;
      const draw = new Draw(canvas, roomId, socket, selectedTool);
      setDrawing(draw);

      return () => {
        draw.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <>
      <canvas ref={canvasRef} height={1000} width={2000}></canvas>
      <ToolsBar selectedTool={selectedTool} onClick={setSelectedTool} />
    </>
  );
}
