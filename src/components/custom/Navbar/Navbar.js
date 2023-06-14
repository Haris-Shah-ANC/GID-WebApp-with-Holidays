import React from 'react';
import Input from '../Elements/Input';
import { imagesList } from '../../../utils/Constant';

const Navbar = ({ handleDrawerClick }) => {
    const bellCount = 3;
    const messageCount = 5;

    return (
        <nav className="bg-white p-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center justify-between sm:justify-start w-full">
                <div className="flex items-center space-x-4">
                    <div className="sm:hidden" onClick={handleDrawerClick}>
                        <i className="fa-solid fa-bars text-gray-600 text-xl"></i>
                    </div>
                    <h1 className="text-gray-600 text-2xl font-medium mr-4">ANC</h1>
                    <div className="hidden sm:block md:block lg:block xl:block">
                        <Searchbar />
                    </div>
                </div>
                <div className="flex ml-auto items-center space-x-4">
                    <div className="relative">
                        <i className="fa-solid fa-bell text-gray-600 text-xl"></i>
                        {bellCount > 0 && (
                            <span className="absolute top-[-8px] right-[-6px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                {bellCount}
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <i className="fa-solid fa-envelope text-gray-600 text-xl"></i>
                        {messageCount > 0 && (
                            <span className="absolute top-[-8px] right-[-6px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                {messageCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center border-l pl-2 pr-2">
                        <div className="flex flex-col">
                            <span className="ml-2 text-gray-600 text-sm">Ajay Pal</span>
                            <span className="ml-2 text-gray-600 text-sm">Employee</span>
                        </div>
                        <img
                            src={imagesList.profile.src}
                            alt={imagesList.profile.alt}
                            className="ml-2 w-10 h-10 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar;

const Searchbar = () => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search"
                className="  w-full placeholder-blueGray-200 text-blueGray-700 border-blueGray-300 rounded px-4 py-2 pr-12 h-10"
            />
            <button className="bg-blue-500 hover:bg-blue-600 outline-none focus:outline-none text-white px-4 py-2 absolute right-0 top-0 h-full rounded-r">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    )
}
