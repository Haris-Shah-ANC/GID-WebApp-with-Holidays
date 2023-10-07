import { useEffect, useState } from "react";
import Tasks from "./tasks/Tasks";
import { ALERTS } from "../../../utils/Constant";
import { useLocation } from "react-router-dom";
import { getEffortAlertsStatus } from "../../../api/urls";
import { apiAction } from "../../../api/api";
import { getWorkspaceInfo } from "../../../config/cookiesInfo";

export default function Alerts() {
    const location = useLocation()
    const paramsData = location.state
    const { work_id } = getWorkspaceInfo();

    const [tasks, setTasks] = useState([])
    const [isNotificationClicked, setNotificationClicked] = useState(false)

    useEffect(() => {
        if (paramsData) {
            setTasks(paramsData)
        } else {
            fetchAlertsStatus()
        }

    }, [])


    const fetchAlertsStatus = async () => {
        let res = await apiAction({ url: getEffortAlertsStatus(), method: "post", data: { workspace_id: work_id } })
            .then((response) => {
                if (response) {
                    setTasks(response.result)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    return (
        <div className="overflow-hidden" style={{ height: 'calc(100vh - 20px)' }}>
            {!isNotificationClicked &&
                <div className="bg-white p-5 my-5 flex flex-col mx-2 cursor-pointer hover:bg-gray-50 " onClick={() => setNotificationClicked(true)}>
                    <div className="flex flex-row items-center ">
                        <div className="h-3 w-3 rounded-full bg-yellow-400 "></div>
                        <span className="text-xl pl-3 text-gray-700 ont-quicksand ">Task Efforts</span>

                    </div>
                    <span className="pl-6 text-gray-400 font-quicksand font-semibold text-md">Please take a moment to review the tasks efforts and provide the duration in hours. </span>
                </div>
            }

            {isNotificationClicked &&
                <div className="">
                    <div className=" h-28" >
                        <svg
                            viewBox="0 0 24 24"
                            fill="blue"
                            height="1.5em"
                            width="1.5em"
                            className="m-2 color-blue-500 cursor-pointer"
                            onClick={() => setNotificationClicked(false)}
                        >
                            <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
                        </svg>
                        <div className="m-2" style={{ height: 'calc(100vh - 200px)', }}>
                            <span className="text-gray-600 font-quicksand font-semibold text-2xl">Please take a moment to review the tasks efforts and provide the duration in hours. </span>
                        </div>
                    </div>
                    <div className="" style={{}}>
                        <Tasks from={ALERTS} taskData={tasks} style={{
                            height: 'calc(100vh - 310px)',
                        }} />
                    </div>
                </div>
            }

        </div>
    )
}