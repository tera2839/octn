"use client";

import { createProps } from "@/lib/api";
import { useState } from "react";

type Props = {
    name: string;
    price: string;
    seller: string;
}

export default function Tweet() {

    const [props, setProps] = useState<Props>({
        name: "",
        price: "",
        seller: "",
    });

    const [message, setMessage] = useState(""); 


    const handleTweet = async(e: React.FormEvent) => {
        e.preventDefault();
        const numericPrice = parseFloat(props.price);
        const {error} = await createProps(props.name,numericPrice,props.seller);
        if(error) {
            setMessage(error + "出品できませんでした")
             console.error("Supabase Error:", error);
        } else {
            setMessage("出品しました！")
            setProps({name: "", price: "",seller: "",});
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProps((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
  };


    return(
        <div className="w-[27%] h-full text-gray-50 rounded-sm text-center pt-4"
         style={{ borderTop: "5px solid rgba(140,140,0,0.2)",borderLeft: "5px solid rgba(140,140,0,0.2)", background: "rgba(150,150,0,0.8)"}}>
            <h2>商品の出品</h2>
            <input value={props.name} onChange={handleChange} placeholder="商品名" type="text" name="name" className="border-2 border-gray-800 rounded-sm mt-10 w-full" />
            <input value={props.price} onChange={handleChange} placeholder="価格" type="number" name="price" className="border-2 border-gray-800 rounded-sm mt-10 w-full" />
            <input value={props.seller} onChange={handleChange} placeholder="出品者名" type="text" name="seller" className="border-2 border-gray-800 rounded-sm mt-10 w-full" />
            <button onClick={handleTweet} className="w-[80%] rounded-md border-2 border-gray-800 m-auto bg-amber-200 text-gray-800 mt-4">出品</button>
            <p>{message}</p>
        </div>
    );
}