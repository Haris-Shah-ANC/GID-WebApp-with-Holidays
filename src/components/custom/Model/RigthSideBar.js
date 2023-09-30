import { useEffect, useState, useContext } from "react";
import { getAddCommentUrl, getCommentListUrl } from "../../../api/urls";
import { useNavigate } from "react-router-dom";
import * as Actions from '../../../state/Actions';
import { apiAction } from "../../../api/api";
import { getLoginDetails, getWorkspaceInfo } from "../../../config/cookiesInfo";
import moment from "moment";
import { formatDate } from "../../../utils/Utils";

export default function RightSideBar(props) {
    const { showModal, setShowModal, taskData } = props;
    const [msgData, setMsgData] = useState({ reply: "" })
    const [chatList, setChatData] = useState([])
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const { work_id } = getWorkspaceInfo();
    const { user_id } = getLoginDetails(useNavigate());

    useEffect(() => {
        getCommentList()
    }, []);

    const getCommentList = async () => {
        let res = await apiAction({ url: getCommentListUrl(), method: 'post', data: { workspace_id: work_id, task_id: taskData.id }, navigate: navigate, dispatch: dispatch })
        if (res) {
            if (res.success) {
                setChatData(res.result)
            }
        }

    }
    const sendComment = async () => {
        let res = await apiAction({ url: getAddCommentUrl(), method: 'post', data: { workspace_id: work_id, task_id: taskData.id, comment: msgData.reply }, navigate: navigate, dispatch: dispatch })
        if (res) {
            if (res.success) {
                setMsgData({ ...msgData, reply: "" })
                getCommentList()
            }
        }

    }
    const onSendMsgClick = () => {
        if (msgData.reply !== '') {
            sendComment()
        }
    }
    const ChatItem = (props) => {
        const { chatData, index } = props
        return (
            <div className=" mt-4">
                {index == 0 ?
                    <p className="text-sm text-gray-600 text-center">{moment(chatData.created_at).format("DD/MM/YYYY")}</p>
                    : formatDate(chatData.created_at, "DD/MM/YYYY") !== formatDate(chatList[index - 1].created_at, "DD/MM/YYYY") ?
                        <p className="text-sm text-gray-600 text-center">{moment(chatData.created_at).format("DD/MM/YYYY")}</p> : null
                }
                {user_id != chatData.comment_by_id ?
                    <div className="flex flex-row">
                        <div>
                            <svg
                                viewBox="0 0 24 24"
                                fill="#949699"
                                height="2em"
                                width="2em"
                            >
                                <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z" />
                            </svg>
                        </div>

                        <div class="bubble">
                            <span className="text-sm px-2 font-medium text-gray-500">{chatData.comment_by_name}</span>
                            <p className="px-2 text-sm">{chatData.comment}</p>
                            <span className="flex justify-end text-xs text-gray-500 pr-3">{moment(chatData.created_at).format("HH:MM A")}</span>
                        </div>
                    </div>
                    :
                    <div className="flex flex-row justify-end">
                        <div class="bubble2">
                            <p className="px-2 text-sm ">{chatData.comment}</p>
                            <span className="flex justify-end text-xs text-gray-500 pr-2">{moment(chatData.created_at).format("HH:MM A")}</span>
                        </div>
                    </div>

                }
            </div>
        )
    }
    return (
        <div className={`custom-modal-dialog ${showModal ?'show':''}`} role="document">
            <div className="">
                <div className="flex flex-row justify-between">
                    <span className="text-xl">#Comments</span>
                    <svg fill="none" viewBox="0 0 24 24" className="cursor-pointer" height="1.5em" width="1.5em" onClick={() => setShowModal(false)}>
                        <path
                            fill="currentColor"
                            d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
                        />
                    </svg>
                </div>
                <div className="no-scrollbar overflow-y-auto overflow-x-hidden pr-1" style={{ height: 'calc(100vh - 250px)', scrollbarWidth: 'none' }} >
                    {chatList.map((item, index) => (<ChatItem chatData={item} index={index} />))}
                    {chatList.length == 0 &&
                        <p className="flex justify-center mt-[35vh]">
                            No data found
                        </p>
                    }
                </div>

            </div>

            <div className="absolute bottom-2 right-2 left-2 "  >
                <div className="flex flex-row justify-between items-between w-full">
                    <div className="flex w-full">
                        <input
                            type={'text'}
                            id={"replyInputBox"}
                            disabled={false}
                            name={''}
                            value={msgData.reply}
                            className={'h-10 flex w-full rounded-lg border-transparent'}
                            onChange={(e) => { setMsgData({ ...msgData, reply: e.target.value }) }}
                            onBlur={() => { }}
                            placeholder={''}
                            autoComplete="new-password"
                            style={{ WebkitAppearance: "none" }}
                            onKeyDown={(e) => {
                                if (e.key == "Enter") {
                                    onSendMsgClick()
                                }
                            }}
                        >
                        </input>
                    </div>
                    {msgData.reply !== "" &&
                        <div className="flex justify-center text-center items-center pl-2">
                            <svg
                                viewBox="0 0 24 24"
                                fill="#060fba"
                                height="1.5em"
                                width="1.5em"
                                className="cursor-pointer"
                                onClick={onSendMsgClick}
                            >
                                <path d="M21.426 11.095l-17-8A1 1 0 003.03 4.242l1.212 4.849L12 12l-7.758 2.909-1.212 4.849a.998.998 0 001.396 1.147l17-8a1 1 0 000-1.81z" />
                            </svg>
                        </div>
                    }

                </div>
            </div>

        </div>
    );
}
