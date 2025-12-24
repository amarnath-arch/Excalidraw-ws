"use client";

import { useRouter } from "next/navigation";

export default function Card({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: number;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        // get the roomId
        router.push(`/canvas/${roomId.toString()}`);
      }}
      className="cursor-pointer hover:-translate-y-1 transition-all duration-200 ease-in-out hover:scale-105 shadow-xl rounded-xl border-slate-200 border p-7 flex flex-col w-40 bg-amber-50"
    >
      {children}
    </div>
  );
}
