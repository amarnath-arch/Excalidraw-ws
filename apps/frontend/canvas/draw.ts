import { getExistingShapes } from "./http";
import { Shape, Tool } from "./types";

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mouseClicked: boolean;
  private startX: number;
  private startY: number;
  private roomId: string;
  private existingShapes: Shape[];
  private socket: WebSocket;
  private selectedTool: Tool;

  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    tool: Tool
  ) {
    this.canvas = canvas;
    // get the context
    this.ctx = canvas.getContext("2d")!;
    this.mouseClicked = false;
    this.startX = 0;
    this.startY = 0;
    this.roomId = roomId;
    this.existingShapes = [];
    this.socket = socket;
    this.selectedTool = tool;

    this.init();
    this.initHandlers(socket);
    this.initMouseHandlers();
  }

  destroy() {
    alert("destroying");
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
  }

  clearCanvasAndDraw() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => {
      if (shape.type == "rect") {
        this.ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type == "circle") {
        this.ctx?.beginPath();

        this.ctx?.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);

        this.ctx?.stroke();

        this.ctx?.closePath();
      } else if (shape.type == "line") {
        this.ctx.beginPath(); // Start a new path
        this.ctx.moveTo(shape.fromX, shape.fromY); // Move the pen to (30, 50)
        this.ctx.lineTo(shape.toX, shape.toY); // Draw a line to (150, 100)
        this.ctx.stroke(); // Render the path
      }
    });
  }

  mouseDownHandler = (e: any) => {
    this.mouseClicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };

  mouseUpHandler = (e: any) => {
    this.mouseClicked = false;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    if (this.selectedTool == "rect") {
      this.existingShapes.push({
        type: this.selectedTool,
        x: this.startX,
        y: this.startY,
        height: height,
        width: width,
      });

      this.socket.send(
        JSON.stringify({
          type: "chat",
          payload: {
            roomId: this.roomId,
            chat: JSON.stringify({
              type: "rect",
              x: this.startX,
              y: this.startY,
              height: height,
              width: width,
            }),
          },
        })
      );
    } else if (this.selectedTool == "circle") {
      const radius = Math.max(width, height) / 2;
      const centerX = this.startX + radius;
      const centerY = this.startY + radius;

      this.existingShapes.push({
        type: "circle",
        x: centerX,
        y: centerY,
        radius: Math.abs(radius),
      });

      this.socket.send(
        JSON.stringify({
          type: "chat",
          payload: {
            roomId: this.roomId,
            chat: JSON.stringify({
              type: "circle",
              x: centerX,
              y: centerY,
              radius: Math.abs(radius),
            }),
          },
        })
      );
    } else if (this.selectedTool == "line") {
      this.existingShapes.push({
        type: this.selectedTool,
        fromX: this.startX,
        fromY: this.startY,
        toX: e.clientX,
        toY: e.clientY,
      });

      this.socket.send(
        JSON.stringify({
          type: "chat",
          payload: {
            roomId: this.roomId,
            chat: JSON.stringify({
              type: "line",
              fromX: this.startX,
              fromY: this.startY,
              toX: e.clientX,
              toY: e.clientY,
            }),
          },
        })
      );
    }

    console.log(e.clientX);
    console.log(e.clientY);
  };

  mouseMoveHandler = (e: any) => {
    console.log(this.mouseClicked);
    if (!this.mouseClicked) {
      return;
    }

    this.clearCanvasAndDraw();

    console.log("selectedTool is : ", this.selectedTool);

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    if (this.selectedTool == "rect") {
      this.ctx?.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool == "circle") {
      console.log("circle");

      const radius = Math.max(width, height) / 2;

      this.ctx?.beginPath();

      this.ctx?.arc(
        this.startX + radius,
        this.startY + radius,
        Math.abs(radius),
        0,
        Math.PI * 2
      );

      this.ctx?.stroke();

      this.ctx?.closePath();
    } else if (this.selectedTool == "line") {
      this.ctx.beginPath(); // Start a new path
      this.ctx.moveTo(this.startX, this.startY); // Move the pen to (30, 50)
      this.ctx.lineTo(e.clientX, e.clientY); // Draw a line to (150, 100)
      this.ctx.stroke(); // Render the path
    }

    console.log(e.clientX);
    console.log(e.clientY);
  };

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvasAndDraw();
  }

  initHandlers(socket: WebSocket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());

      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.payload.chat.toString());
        console.log("shape found is : ", parsedShape);
        this.existingShapes.push(parsedShape);
        this.clearCanvasAndDraw();
      }
    };
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
