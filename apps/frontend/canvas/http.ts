import axios from "axios";

export async function getExistingShapes(roomId: string) {
  console.log("bckend url", process.env.NEXT_PUBLIC_BACKEND_URL);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/chat/${roomId}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );

  const chats = response.data.chats ?? [];

  return chats.map((x: { message: string }) => {
    return JSON.parse(x.message);
  });
}
