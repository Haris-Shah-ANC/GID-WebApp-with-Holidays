import { useState } from "react";
import Tasks from "./tasks/Tasks";
import { ALERTS } from "../../../utils/Constant";

export default function Alerts(props) {
    const [isNotificationClicked, setNotificationClicked] = useState(false)
    return (
        <div className="overflow-y-hidden">
            {!isNotificationClicked &&
                <div className="bg-white p-5 my-5 flex flex-col mx-2 cursor-pointer hover:bg-gray-50 overflow-hidden" onClick={() => setNotificationClicked(true)}>
                    <div className="flex flex-row items-center ">
                        <div className="h-3 w-3 rounded-full bg-yellow-400 "></div>
                        <span className="text-xl pl-3 text-gray-700 ont-quicksand ">Task Efforts</span>

                    </div>
                    <span className="pl-6 text-gray-400 font-quicksand font-semibold text-md">Please take a moment to review the tasks efforts and provide the duration in hours. </span>
                </div>
            }

            {isNotificationClicked &&
                <div className="overflow-y-hidden ">
                    <svg
                        viewBox="0 0 24 24"
                        fill="blue"
                        height="1.5em"
                        width="1.5em"
                        className="m-2 color-blue-500 cursor-pointer"
                        onClick={()=>setNotificationClicked(false)}
                    >
                        <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
                    </svg>
                    <div className="m-2">
                        <span className="text-gray-600 font-quicksand font-semibold text-2xl">Please take a moment to review the tasks efforts and provide the duration in hours. </span>
                    </div>
                    
                    <div className="mt-8 overflow-hidden" style={{ height: 'calc(100vh - 190px)',display:'flex' }}>
                        <Tasks from={ALERTS}></Tasks>
                    </div>
                </div>
            }

        </div>
    )
}