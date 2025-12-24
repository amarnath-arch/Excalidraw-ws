"use client";
import Card from "@/components/Card";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function Dashboard() {
  //   const rooms = await axios.get(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/rooms`,
  //     {
  //       headers: {
  //         Authorization: localStorage.getI,
  //       },
  //     }
  //   );

  const [createdRooms, setCreatedRooms] = useState<[]>();

  useEffect(() => {
    const getRooms = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/rooms`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status.toString() == "200") {
        console.log("rooms found are : ", response.data.rooms);
        setCreatedRooms(response.data.rooms);
      }
    };
    getRooms();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <DashboardNav />

      <main className="flex-1 flex flex-col p-10">
        <h1 className="text-center mt-5 font-bold text-2xl">Created Rooms</h1>
        {!createdRooms ? (
          <div>...loading Rooms</div>
        ) : createdRooms.length == 0 ? (
          <div className="flex flex-1 justify-center items-center text-2xl font-bold">
            No Rooms
          </div>
        ) : (
          <div className="flex flex-wrap gap-10 mt-15">
            {createdRooms?.map((room: any) => {
              return (
                <Card roomId={room.id}>
                  <div className="text-2xl font-bold">{room?.slug}</div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
