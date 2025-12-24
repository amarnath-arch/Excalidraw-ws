"use client";
import { useEffect, useState } from "react";
import { SketchIcon } from "./Landing";
import Modal from "./Modal";
import axios from "axios";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";

export default function DashboardNav() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [joinModalOpen, setJoinModalOpen] = useState<boolean>(false);
  const [canCreateRoom, setCanCreateRoom] = useState<boolean>();
  const [canJoinRoom, setCanJoinRoom] = useState<boolean>();

  const [inputValue, setInputValue] = useState<string>();
  const [joinRoomInput, setJoinRoomInputValue] = useState<string>();

  const debouncedInput = useDebounce(inputValue, 300);
  const debouncedJoinRoomInput = useDebounce(joinRoomInput, 300);

  const router = useRouter();

  useEffect(() => {
    if (!debouncedInput) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/roomExists/${debouncedInput}`;

    console.log("Calling API:", url);

    axios.get(url).then((res) => {
      console.log(res.data.message);
      if (res.data.message == "Room does not exist") {
        setCanCreateRoom(true);
      } else {
        setCanCreateRoom(false);
      }

      // refetch
    });
  }, [debouncedInput]);

  useEffect(() => {
    if (!debouncedJoinRoomInput) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/roomExists/${debouncedJoinRoomInput}`;

    console.log("Calling API:", url);

    axios.get(url).then((res) => {
      console.log(res.data.message);
      if (res.data.message == "Room does not exist") {
        setCanJoinRoom(false);
      } else {
        setCanJoinRoom(true);
      }

      // refetch
    });
  }, [debouncedJoinRoomInput]);

  function closeModal() {
    setOpenModal(false);
  }

  function closeJoinModal() {
    setJoinModalOpen(false);
  }

  return (
    <nav className="flex justify-between px-20 py-5 border-b border-b-slate-100">
      <div className="flex items-center gap-2">
        <SketchIcon />
        <span className="text-xl font-bold text-foreground">Sketchboard</span>
      </div>
      <div className="flex gap-10">
        <button
          onClick={() => setJoinModalOpen(true)}
          className="cursor-pointer hover:-translate-y-0.5 bg-blue-500 px-6 py-3 text-white rounded-xl hover:bg-blue-500/96 "
        >
          + Join Room
        </button>

        <button
          onClick={() => setOpenModal(true)}
          className="cursor-pointer hover:-translate-y-0.5 bg-blue-500 px-6 py-3 text-white rounded-xl hover:bg-blue-500/96 "
        >
          + Create Room
        </button>
      </div>

      {openModal && (
        <Modal closeModal={closeModal}>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Enter Room Name "
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              className="px-6 py-3 border border-slate-200 rounded-xl placeholder:font-semibold"
            />

            {!canCreateRoom && (
              <span className="text-red-500">Room Name Already Exists</span>
            )}
            <button
              disabled={!canCreateRoom ? true : false}
              onClick={async () => {
                if (!canCreateRoom) {
                  return;
                }

                const res = await axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/room`,
                  {
                    slug: debouncedInput,
                  },
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                );

                setOpenModal(false);

                if (res.status.toString() == "200") {
                  window.location.reload();
                } else {
                  alert("request failed");
                }
              }}
              className={`${!canCreateRoom ? "bg-slate-200 cursor-none text-black" : ""} cursor-pointer w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-500/90 hover:scale-102 transition-transform duiratino-100 ease-in-out cursor-pointer `}
            >
              Create Room
            </button>
          </div>
        </Modal>
      )}

      {joinModalOpen && (
        <Modal closeModal={closeJoinModal}>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Enter Room Name "
              onChange={(e) => {
                setJoinRoomInputValue(e.target.value);
              }}
              className="px-6 py-3 border border-slate-200 rounded-xl placeholder:font-semibold"
            />

            {!canJoinRoom && (
              <span className="text-red-500">Room Name Does Not Exist</span>
            )}
            <button
              disabled={!canJoinRoom ? true : false}
              onClick={async () => {
                if (!canJoinRoom) {
                  return;
                }

                const response = await axios.get(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/room/${debouncedJoinRoomInput}`,
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                );

                if (response.status.toString() == "200") {
                  const roomId = response.data.roomId;
                  router.push(`/canvas/${roomId}`);
                }
              }}
              className={`${!canJoinRoom ? "bg-slate-200 cursor-none text-black" : ""} cursor-pointer w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-500/90 hover:scale-102 transition-transform duiratino-100 ease-in-out cursor-pointer `}
            >
              Join Room
            </button>
          </div>
        </Modal>
      )}
    </nav>
  );
}
