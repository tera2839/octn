"use client";

import Sidebar from "@/components/Sidebar";
import Tweet from "@/components/Tweet";
import Posts from "@/components/Post";


export default function Home() {

  

  return (
    <div className="w-full h-full m-auto bg-amber-100">
      <div className="w-full lg:w-[70%] flex h-full bg-amber-50 m-auto">
        <Sidebar />
        <Posts />
        <Tweet />
      </div>
    </div>  
  )
}