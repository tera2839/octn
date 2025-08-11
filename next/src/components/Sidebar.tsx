"use client";

import ClearAllIcon from '@mui/icons-material/ClearAll';
import Link from 'next/link';

export default function Sidebar() {

    return(
        <div className='w-[16%] h-full p-4 text-gray-100 z-10 rounded-sm'
        style={{ borderTop: "5px solid rgba(150,150,0,0.9)",borderRight: "5px solid rgba(150,150,0,0.9)", background: "rgba(130,130,0,0.8)"}}>
            <div className='flex'>
                <h2 className='text-2xl'>Octn</h2>
                <ClearAllIcon className='mt-0.2' sx={{fontSize: '34px'}}/>
            </div>
            <ul>
                <li className='mt-3'><Link href="/home">ホーム</Link></li>
                <li className='mt-3'><Link href="/profile">プロフィール</Link></li>
                <li className='mt-3'><Link href="/setting">設定</Link></li>
            </ul>
        </div>
    );
}