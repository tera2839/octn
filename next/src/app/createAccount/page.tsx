"use client"
import Link from "next/link"
import ClearAllIcon from '@mui/icons-material/ClearAll';
import React, { useState } from "react";
import { createUser } from "@/lib/api";

export default function CreateAccount() {

    type User = {
      id: string;
      mail: string;
      pass: string;
    }

    type ModalState = {
      isOpen: boolean;
      isSuccess: boolean;
    }

    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [modal, setModal] = useState<ModalState>({isOpen: false, isSuccess: false});
    const [message, setMessage] = useState("");
    const [form, setForm] = useState<User[]>([]);
    const [valMail,setValMail] = useState("");
    const [valPass,setValPass] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      const {data,error} = await createUser(mail,pass);
        if(error) {
          setMessage("登録に失敗しました。")
          console.log(error, "error");
          setModal({isOpen: true, isSuccess: false});
        } else {
          setMessage("登録しました！")
          setForm(data ?? [])
          setModal({isOpen: true, isSuccess: true});
        }
    }

    const handleClose = (e: React.FormEvent) => {
      e.preventDefault();
      setModal({isOpen: false, isSuccess: false})
    }

    const validationCheckMail = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setMail(e.target.value);
      if(!e.target.value.match("@")) {
        setValMail("有効なメールアドレスを入力してください")
      } else {
        setValMail("");
      }
    }

    const validationCheckPass = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setPass(e.target.value);
      if(e.target.value.length < 7) {
        setValPass("パスワードは7文字以上で入力してください");
      } else {
        setValPass("");
      }
    }

    return (
    <div className="w-full h-full bg-amber-50 m-0 p-0 pt-50 ">
      <div className="w-110 h-14 mx-auto flex justify-center">
        <h1 className="text-center text-4xl">Tweets</h1>
        <ClearAllIcon sx={{fontSize: '48px'}}/>
      </div>
      <form className="border-3 w-100 h-110 mx-auto text-center rounded-2xl border-orange-100 bg-orange-50 shadow-md py-5">
        <h2 className="w-1/2 h-6 mx-auto  my-5 text-2xl" >アカウント作成</h2>
        <p className="mt-8">メールアドレス</p>
        <input type="text" name="mail" placeholder="メールアドレス" className="bg-white border-b-2 rounded-b-sm" value={mail} onChange={validationCheckMail} />
        <p className="text-red-500 text-sm">{valMail}</p>
        <p className="mt-8">パスワード</p>
        <input type="text" name="pass" placeholder="パスワード"  className="bg-white border-b-2 rounded-b-sm" value={pass} onChange={validationCheckPass} /><br />
        <p className="text-red-500 text-sm">{valPass}</p>
        <div className="h-20 w-full">
            <button onClick={handleAdd} type="submit" className="mt-8 bg-amber-200 w-40 h10 rounded-2xl shadow-md border-2 border-gray-600 cursor-pointer inversion-login-color">作成</button>
        </div>
      　<p><Link href={"/"} className="text-blue-500">戻る</Link></p>
      </form>
      {modal.isOpen && (
        <div>
          <div className="w-full h-full z-10 absolute top-0 left-0 opacity-40 bg-gray-700"></div>
          <div className="border-3 w-80 h-90 mx-auto text-center rounded-2xl border-orange-100 bg-orange-50 shadow-md py-5 z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-2xl">{message}</h2>
            {form.map(f => (
             <p key={f.id} className="mt-10 w-full h-10">メールアドレス<br></br>{f.mail}</p>
            ))}
            {modal.isSuccess ? (
              <Link href="/" className="h-10 w-full text-blue-600 mt-10 block">ログイン画面に戻る</Link>
            ) : (
              <button onClick={handleClose} className="h-10 w-full  text-blue-600 block mt-10">戻る</button>
            )}
          </div>
        </div> 
      )}
    </div>
    )
}


