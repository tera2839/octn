"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type Item = {
    id: string;
    name: string;
    price: number;
    seller: string;
};

export default function Posts() {
    const [items, setItems] = useState<Item[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [globalLoading, setGlobalLoading] = useState(false);

    // 商品一覧取得
    const fetchItems = async () => {
        setGlobalLoading(true);
        const { data, error } = await supabase.from("props").select("*");
        if (error) {
            console.error("取得エラー:", error);
        } else {
            setItems(data ?? []);
        }
        setGlobalLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // PDFダウンロード処理
    const downloadPDF = async (reportData: any) => {
        try {
            const response = await fetch("http://localhost:8000/api/report/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData),
            });
            if (!response.ok) throw new Error("帳票APIエラー");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "receipt.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDFダウンロード失敗:", err);
        }
    };

    // 購入処理
    const handlePurchase = async (id: string) => {
        setLoadingId(id);

        const item = items.find(i => i.id === id);
        if (!item) {
            console.error("商品が見つかりません");
            setLoadingId(null);
            return;
        }

        // Supabaseから削除
        const { error } = await supabase.from("props").delete().eq("id", id);
        if (error) {
            console.error("削除エラー:", error);
            setLoadingId(null);
            return;
        }

        // 帳票データ作成
        const reportData = {
            items: [
                {
                    name: item.name,
                    amount: item.price,
                    seller: item.seller,
                },
            ],
        };

        await downloadPDF(reportData);
        await fetchItems();
        setLoadingId(null);
    };

    return (
        <div className="w-[67%] h-full bg-amber-200 text-center p-4">
            <h2 className="text-xl font-bold mb-4">商品一覧</h2>
            {globalLoading && <p>読み込み中...</p>}
            {!globalLoading && items.length === 0 && <p>商品がありません</p>}
            {items.map(item => (
                <div key={item.id} className="w-[80%] m-auto bg-amber-400 mb-6 rounded-2xl p-4 shadow-md">
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p>{item.price}円</p>
                    <p className="text-sm text-gray-700">出品者: {item.seller}</p>
                    <button
                        onClick={() => handlePurchase(item.id)}
                        className="w-[80%] rounded-md border-2 border-gray-800 bg-amber-200 text-gray-800 mt-4 py-1"
                        disabled={loadingId === item.id}
                    >
                        {loadingId === item.id ? "処理中..." : "購入する"}
                    </button>
                </div>
            ))}
        </div>
    );
}
