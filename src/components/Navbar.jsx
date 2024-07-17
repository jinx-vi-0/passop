import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white '>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">

                <div className="logo font-bold text-white text-2xl">
                    <span className='text-green-600'> &lt;</span>
                    <span>Pass</span><span className='text-green-600'>OP/&gt;</span>
                </div>
                <a href="https://github.com/jinx-vi-0" target="_blank" rel="noopener noreferrer"><button className='text-white my-5 mx-2 rounded-full flex  justify-between items-center ring-white ring-1'>
                    <img className='invert  w-10 p-1' src="/icons/github.png" alt="github logo" />
                </button></a>
            </div>
        </nav>
    )
}

export default Navbar
