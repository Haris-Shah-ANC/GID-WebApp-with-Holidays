import React, { useRef, useState } from 'react';
import Input from '../Elements/Input';
import { MENU, imagesList } from '../../../utils/Constant';
import { clearCookie, getWorkspaceInfo } from '../../../config/cookiesInfo';
import { getLoginDetails } from '../../../config/cookiesInfo';
import Sidebar from '../Sidebar/Sidebar';

const Navbar = ({ logOutClick }) => {
    const bellCount = 3;
    const messageCount = 5;
    const workspace = getWorkspaceInfo()
    const userInfo = getLoginDetails()
    const [isPopupMenuVisible, setPopupMenuVisibility] = useState(false)
    const menuRef = useRef()
    const imgRef = useRef()

    const sideNavigationRef= useRef()
    

    window.addEventListener('click', (e) => {
        if (e.target !== menuRef.current && e.target !== imgRef.current) {
            setPopupMenuVisibility(false)
        }else if(e.target === sideNavigationRef.current){
            console.log("INSIDE ELSE IF")
            setSidebarShow("-translate-x-full");
        }
    })
    const [sidebarShow, setSidebarShow] = React.useState("-translate-x-full");
    // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    const handleDrawerClick = () => {
        // setIsSidebarOpen(!isSidebarOpen);
        if (sidebarShow === "") {
            setSidebarShow("-translate-x-full");
        } else {
            setSidebarShow("");
        }
    };
    return (
        <div>
            <nav className="bg-white p-4 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center justify-between sm:justify-start w-full">
                    <div className="flex items-center space-x-4">
                        <div className="sm:hidden" onClick={handleDrawerClick}>
                            <i className="fa-solid fa-bars text-gray-600 text-xl"></i>
                        </div>
                        <h1 className="text-gray-600 text-2xl font-medium mr-4">{workspace.workspace_name}</h1>
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
                                <span className="ml-2 text-gray-600 text-sm">{userInfo.name}</span>
                                <span className="ml-2 text-gray-600 text-sm">{workspace.role}</span>
                            </div>
                            <div className='relative flex mr-5'>
                                <img
                                    ref={imgRef}
                                    src={imagesList.profile.src}
                                    alt={imagesList.profile.alt}
                                    className="ml-2 w-10 h-10 rounded-full"
                                    onClick={() => { setPopupMenuVisibility(!isPopupMenuVisible) }}
                                />
                                {
                                    isPopupMenuVisible &&
                                    <div
                                        ref={menuRef}
                                        className='absolute bg-white shadow-xl w-auto mt-10 flex flex-col -left-20 rounded-md'>
                                        <ul className='font-medium font-quicksand text-sm w-40 p-2'>
                                            {
                                                MENU.map((menu) => (
                                                    <li key={menu} className="p-2 rounded-md hover:bg-blue-50" >{menu}</li>
                                                ))
                                            }
                                        </ul>
                                        <div className='h-[1px] bg-gray-200'></div>
                                        <button className='font-medium font-quicksand text-sm w-28 pl-4 py-2 text-left hover:bg-blue-50' onClick={() => { logOutClick() }}>Logout</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* <div className={`bg-white text-white sm:hidden absolute top-0 bottom-0 w-64 shadow-xl flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 ${sidebarShow}`}> */}
            <div className={`bg-white text-white sm:hidden top-0 bottom-0 absolute transition-all duration-300 md:z-10 z-9999 w-72 ${sidebarShow}`}>
                    <Sidebar isSidebarOpen={true} setIsSidebarOpen={(value) => handleDrawerClick()}></Sidebar>
                </div>
        </div>
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
