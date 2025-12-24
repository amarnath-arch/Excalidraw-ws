"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useState } from "react";

export default function Auth() {
  const [selectedTab, setSelectedTab] = useState<"SignUp" | "SignIn">("SignUp");

  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function SubmitAuthHandler() {
    if (emailInputRef.current && passwordInputRef.current) {
      if (selectedTab == "SignIn") {
        if (
          emailInputRef.current.value == "" ||
          passwordInputRef.current.value == ""
        ) {
          return;
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`,
            {
              email: emailInputRef.current.value,
              password: passwordInputRef.current.value,
            }
          );

          console.log(response);

          if (response.status.toString() == "200") {
            const token = response.data.token;
            localStorage.setItem("token", token);
            router.push("/dashboard");
          }
          emailInputRef.current.value = "";
          passwordInputRef.current.value = "";
        } catch (err) {
          console.error(err);
          return;
        }
      } else if (selectedTab == "SignUp") {
        alert(process.env.NEXT_PUBLIC_BACKEND_URL);

        if (!nameInputRef.current) {
          return;
        }

        if (
          emailInputRef.current.value == "" ||
          passwordInputRef.current.value == "" ||
          nameInputRef.current.value == ""
        ) {
          return;
        }
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signup`,
            {
              email: emailInputRef.current.value,
              password: passwordInputRef.current.value,
              name: nameInputRef.current.value,
            }
          );

          console.log(response);

          if (response.status.toString() == "200") {
            const token = response.data.token;
            localStorage.setItem("token", token);
            router.push("/dashboard");
          }

          emailInputRef.current.value = "";
          passwordInputRef.current.value = "";
          nameInputRef.current.value = "";
        } catch (err) {
          console.error(err);
          return;
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <div
        className={`p-5 flex flex-col bg-whtie border-slate-200 border rounded-xl shadow-xl bg-white w-110`}
      >
        <div className="flex items-center p-5">
          <div
            className={`w-[50%] font-semibold rounded-xl cursor-pointer p-3 text-center ${selectedTab == "SignIn" ? "bg-slate-200" : "hover:bg-slate-100"}`}
            onClick={() => setSelectedTab("SignIn")}
          >
            SignIn
          </div>
          <div
            className={`w-[50%] font-semibold p-3 rounded-xl cursor-pointer text-center ${selectedTab == "SignUp" ? "bg-slate-200" : "hover:bg-slate-100"} `}
            onClick={() => setSelectedTab("SignUp")}
          >
            SignUp
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-5">
          <input
            type="text"
            ref={emailInputRef}
            placeholder="Enter email"
            className={`w-full px-6 py-3 border rounded-xl border-slate-100`}
          />

          {selectedTab == "SignUp" && (
            <input
              type="text"
              ref={nameInputRef}
              placeholder="Enter name"
              className={`w-full px-6 py-3 border rounded-xl border-slate-100`}
            />
          )}

          <input
            type="password"
            ref={passwordInputRef}
            placeholder="Enter password"
            className={`w-full px-6 py-3 border rounded-xl border-slate-100`}
          />

          <button
            onClick={SubmitAuthHandler}
            className="py-3 px-6 w-full bg-slate-300 rounded-xl font-semibold cursor-pointer hover:scale-102 duration-200 transition-transform ease-in-out"
          >
            {selectedTab == "SignIn" ? "SignIn" : "SignUp"}
          </button>
        </div>
      </div>
    </div>
  );
}
