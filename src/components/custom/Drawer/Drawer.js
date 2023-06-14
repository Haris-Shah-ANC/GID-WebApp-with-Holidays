import React from 'react';
import { imagesList } from '../../../utils/Constant';
import { routesName } from '../../../config/routesName';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Drawer = ({ isDrawerOpen, handleDrawerClick, navigationUrl = [] }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const [activeItem, setActiveItem] = React.useState(routesName.dashboard.activeRoute);

    React.useEffect(() => {
        let pathname = Object.values(routesName).find((item) => item.path === location.pathname);
        let currentRoute = Object.keys(routesName).find((routeKey) => {
            return pathname && routesName[routeKey].path === pathname.path
        })

        if (currentRoute) {
            setActiveItem(routesName[currentRoute].activeRoute)
        }
    }, [location.pathname])
    return (
            <div className={`${isDrawerOpen?'transition-transform':''} drawer absolute bg-blue-500 text-white flex flex-col left-0 w-60 rounded shadow-lg min-h-screen z-40`}>
                <div className="flex items-center justify-between border-b border-gray-400">
                    <div className='flex'>
                        <img
                            src={imagesList.appLogo.src}
                            alt={imagesList.appLogo.alt}
                            className="w-20 h-20rounded-full mr-4"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold">GET IT</span>
                            <span className="text-xl font-bold">DONE</span>
                        </div>
                    </div>
                    <button
                        className="p-2 text-white"
                        onClick={handleDrawerClick}
                    >
                        {isDrawerOpen ?
                            <span className='border-gray-400 px-4 py-2 rounded-full'>
                                <i className="fa-solid fa-xmark text-3xl"></i>
                            </span>
                            :
                            <i className="fa-solid fa-bars text-3xl"></i>
                        }
                    </button>
                </div>
                <nav className="flex-grow">
                    <ul className="flex flex-col">
                        {navigationUrl.map((item, index) => (
                            <React.Fragment key={index}>
                                <li className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-700 font-semibold' : ''} p-4 border-b border-gray-400 flex items-center hover:bg-blue-600`} onClick={() => { navigate(item.path); handleDrawerClick() }}>
                                    <Link to={item.path} className="text-white  cursor-pointer" onClick={() => { navigate(item.path); handleDrawerClick() }}>
                                        <i className={`${item.icon} mr-2`} ></i>
                                        <span className={`${isSidebarOpen ? '' : 'hidden'}`}>{item.name}</span>
                                    </Link>
                                </li>
                                {/* {isDrawerOpen && (
                                    <div className="fixed inset-0">
                                        <div
                                            className="absolute top-0 left-0 w-full h-full cursor-pointer"
                                            onClick={() => { navigate(item.path); handleDrawerClick(); }}
                                        />
                                    </div>
                                )} */}
                            </React.Fragment>
                        ))}
                    </ul>
                </nav>
            </div>
    );
};

export default Drawer;
