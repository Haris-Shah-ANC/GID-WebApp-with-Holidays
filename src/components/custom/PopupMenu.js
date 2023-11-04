import { useEffect, useRef, useState } from "react";

const PopupMenu = (props) => {
    const { item, onMenuItemClick = () => { }, isClicked, onClose = () => { }, menuOptions } = props
    const [isOpen, setIsOpen] = useState(isClicked);
    const menuRef = useRef();

    useEffect(() => {
        setIsOpen(isClicked)
    }, [isClicked])

    useEffect(() => {
        // Function to handle clicks outside of the menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose()
                setIsOpen(false);
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (e) => {
        setIsOpen(!isOpen);
        e.stopPropagation();
    };

    return (
        <div className="relative" ref={menuRef} >
            {/* <div className='px-2 py-0.5  '>
                <button onClick={(e) => toggleMenu(e)} className=""
                    >
                    <i class="fa-solid fa-ellipsis" style={{ color: '#4a4c4f', cursor: 'pointer', display: isIconVisible ? "flex" : 'none' }} ></i>
                </button>
            </div> */}
            {isOpen && (
                <div className="absolute right-[-40px] mt-2 bg-white border rounded shadow-lg z-5">

                    <ul>
                        {menuOptions.map((menuItem) => (
                            <li className={`px-4 py-2 hover:bg-gray-100 text-sm font-quicksand font-medium cursor-pointer ${menuItem.action == "Delete" ? "text-red-500" : ""}`} onClick={() => onMenuItemClick(menuItem.action, item)}>{menuItem.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PopupMenu;