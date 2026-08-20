'use client';
import Link from 'next/link';
const links=[['/','Home'],['/parking','Live Parking'],['/research','Research'],['/product','Product'],['/pricing','Pricing'],['/marketing','Marketing'],['/assistant','Assistant'],['/dashboard','Dashboard'],['/docs','Docs'],['/demo','Demo']];
export default function Nav(){return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 py-4"><Link href="/" className="whitespace-nowrap text-xl font-bold">PARK <span className="text-emerald-400">NOW</span></Link><nav className="flex gap-4 text-sm text-slate-300">{links.map(([h,l])=><Link key={h} className="whitespace-nowrap hover:text-white" href={h}>{l}</Link>)}</nav></div></header>}
