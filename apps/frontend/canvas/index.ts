import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      height: number;
      width: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  // get the context
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  clearCanvasAndDraw(existingShapes, canvas, ctx);

  // receiving a shape over socket

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data.toString());

    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.payload.chat.toString());
      console.log("shape found is : ", parsedShape);
      existingShapes.push(parsedShape);
      clearCanvasAndDraw(existingShapes, canvas, ctx);
    }
  };

  let mouseClicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    mouseClicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  //   canvas.addEventListener("mouseup", (e) => {
  //     alert("here");
  //   });

  canvas.addEventListener("mouseup", (e) => {
    mouseClicked = false;
    existingShapes.push({
      type: "rect",
      x: startX,
      y: startY,
      height: e.clientY - startY,
      width: e.clientX - startX,
    });

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          roomId: roomId,
          chat: JSON.stringify({
            type: "rect",
            x: startX,
            y: startY,
            height: e.clientY - startY,
            width: e.clientX - startX,
          }),
        },
      })
    );

    console.log(e.clientX);
    console.log(e.clientY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!mouseClicked) {
      return;
    }

    clearCanvasAndDraw(existingShapes, canvas, ctx);

    ctx?.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY);

    console.log(e.clientX);
    console.log(e.clientY);
  });
}

function clearCanvasAndDraw(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null
) {
  ctx?.clearRect(0, 0, canvas.height, canvas.width);

  existingShapes.forEach((shape) => {
    if (shape.type == "rect") {
      ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  console.log("bckend url", process.env.NEXT_PUBLIC_BACKEND_URL);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/chat/${roomId}`
  );

  const chats = response.data.chats ?? [];

  return chats.map((x: { message: string }) => {
    return JSON.parse(x.message);
  });
}
