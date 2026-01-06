'use client'
import React from 'react'


export default function Header(){
return (
<header className="flex items-center justify-between p-4 bg-white border-b">
<div className="flex items-center gap-4">
<h1 className="text-xl font-semibold">Admin Dashboard</h1>
</div>
<div className="flex items-center gap-4">
<div className="text-sm">Welcome, Admin</div>
<button className="btn bg-red-500 text-white">Logout</button>
</div>
</header>
)
}