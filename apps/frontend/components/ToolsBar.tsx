import { Tool } from "@/canvas/types";
import { RectangleHorizontal, Circle, PenLine } from "lucide-react";

export default function ToolsBar({
  selectedTool,
  onClick,
}: {
  selectedTool: Tool;
  onClick: any;
}) {
  return (
    <div className="fixed top-5  bg-white left-1/2 -translate-x-1/2 flex gap-5 px-4 py-2 border border-slate-100 rounded-xl shadow-xl">
      <div
        onClick={() => onClick("rect")}
        className={`${selectedTool == "rect" ? "bg-toolbar-background" : ""} p-1 text-sm flex justify-center items-center rounded-xl cursor-pointer hover:bg-toolbar-background/90 transition-all duration-100 ease-in-out hover:scale-101`}
      >
        <RectangleHorizontal />
      </div>
      <div
        onClick={() => onClick("circle")}
        className={`${selectedTool == "circle" ? "bg-toolbar-background" : ""} p-1 text-sm flex justify-center items-center rounded-xl cursor-pointer hover:bg-toolbar-background/90 transition-all duration-100 ease-in-out hover:scale-101`}
      >
        <Circle />
      </div>
      <div
        onClick={() => onClick("line")}
        className={`${selectedTool == "line" ? "bg-toolbar-background" : ""} p-1 text-sm flex justify-center items-center rounded-xl cursor-pointer hover:bg-toolbar-background/90 transition-all duration-100 ease-in-out hover:scale-101`}
      >
        <PenLine />
      </div>
    </div>
  );
}
