"use client";
import Link from "next/link";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { loginUser } from "../lib/api";
import { useState } from "react";

export default function Home() {

  const [mail,setMail] = useState("");
  const [pass,setPass] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    const {error} = await loginUser(mail,pass);

    if(error) {
      setMessage("アカウント名またはパスワードが間違っています。");
      console.log(error);
      
    } else {
      window.location.href = "/home";
    }
  }

  return (
    <div className="w-full h-full bg-amber-50 m-0 p-0 pt-50">
      <div className="w-110 h-14 mx-auto flex justify-center">
        <h1 className="text-center text-4xl">Octn</h1>
        <ClearAllIcon sx={{fontSize: '48px'}}/>
      </div>
      <form className="border-3 w-100 h-110 mx-auto text-center rounded-2xl border-orange-100 bg-orange-50 shadow-md py-5" onSubmit={handleLogin}>
        <h2 className="w-1/2 h-6 mx-auto  my-5 text-2xl" >ログイン</h2>
        <p className="mt-10">メールアドレス</p>
        <input type="text" name="mail" placeholder="メールアドレス" className="bg-white border-b-2 rounded-b-sm" value={mail} onChange={(e) => setMail(e.target.value)} />
        <p className="mt-8">パスワード</p>
        <input type="password" name="pass" placeholder="パスワード"  className="bg-white border-b-2 rounded-b-sm" value={pass} onChange={(e) => setPass(e.target.value)}/><br />
        <div className="h-20 w-full"> 
          <p className="text-red-500">{message}</p>
          <button type="submit" onClick={handleLogin} className="mt-8 bg-amber-200 w-40 h10 rounded-2xl shadow-md border-2 border-gray-600 cursor-pointer inversion-login-color">ログイン</button>
        </div>
        <p>アカウント作成は<Link href={"/createAccount"} className="text-blue-500">こちら</Link></p>
      </form>
    </div>
  );
}
