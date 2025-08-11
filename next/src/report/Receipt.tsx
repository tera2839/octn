// /src/report/ReceiptTemplate.tsx
import React from 'react';

type Props = {
  name: string;
  price: number;
  seller: string;
};

const Receipt = ({ name, price }: Props) => {
  return (
    <div className="w-[600px] p-6 border border-gray-300 rounded-xl shadow-lg mx-auto mt-10 font-sans text-gray-800">
      <h1 className="text-2xl font-bold text-center mb-6">領収書</h1>

      <div className="mb-4">
        <p className="text-lg">宛名：<span className="font-semibold">{name}</span> 様</p>
      </div>

      <div className="mb-4">
        <p className="text-lg">金額：<span className="text-xl font-bold text-red-600">¥{price.toLocaleString()}</span>（税込）</p>
      </div>

      <div className="mt-6 text-sm">
        <p>上記の金額を正に領収いたしました。</p>
        <p className="mt-4">発行日：{new Date().toLocaleDateString()}</p>
        <p>発行者：株式会社サンプル</p>
        <p>住所：東京都千代田区1-2-3</p>
        <p>電話：03-1234-5678</p>
      </div>
    </div>
  );
};

export default Receipt;
