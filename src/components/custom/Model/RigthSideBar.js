import React, { useEffect, useState, useContext, useLayoutEffect, useRef } from "react";
import { getAddCommentUrl, getCommentListUrl } from "../../../api/urls";
import { useNavigate } from "react-router-dom";
import * as Actions from '../../../state/Actions';
import { apiAction } from "../../../api/api";
import { getLoginDetails, getWorkspaceInfo } from "../../../config/cookiesInfo";
import moment from "moment";
import { formatDate } from "../../../utils/Utils";
import { Typography } from "@mui/material";
import { FaAngleDown } from "react-icons/fa"; // Import the dropdown icon
//
export default function CommentsSideBar(props) {
    const { showModal, setShowModal, taskData } = props;
    const [msgData, setMsgData] = useState({ reply: "" })
    const [chatList, setChatData] = useState([])
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const { work_id } = getWorkspaceInfo();
    const { user_id } = getLoginDetails(useNavigate());

    const [openOptionsIndex, setOpenOptionsIndex] = useState(null); // State to track open options in comment section
    // const [isOptionsVisible, setIsOpensVisible] = useState(null);

    let MIN_TEXTAREA_HEIGHT = 50;
    const textFieldRef = useRef(null)

    useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textFieldRef.current.style.height = "50px";
        //Set height
        textFieldRef.current.style.height = `${Math.max(
            textFieldRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [msgData.reply, MIN_TEXTAREA_HEIGHT]);

    useEffect(() => {
        getCommentList()
    }, [taskData]);

    useLayoutEffect(() => {
        scrollToBottom()
    }, [chatList])

    const scrollToBottom = () => {
        var element = document.querySelector('#element');
        element.scrollTop = element.scrollHeight;
    }

    const getCommentList = async () => {
        let res = await apiAction({ url: getCommentListUrl(), method: 'post', data: { workspace_id: work_id, task_id: taskData.id }, navigate: navigate, dispatch: dispatch })
        if (res) {
            if (res.success) {
                setChatData(res.result)
            }
        }
    }


    const sendComment = async () => {
        if (msgData.reply !== '') {
            // Replace line breaks with <br> tags when sending the message
            const messageWithLineBreaks = msgData.reply.replace(/\n/g, '<br>');

            let res = await apiAction({
                url: getAddCommentUrl(),
                method: 'post',
                data: { workspace_id: work_id, task_id: taskData.id, comment: messageWithLineBreaks },
                navigate: navigate,
                dispatch: dispatch
            });

            if (res && res.success) {
                setMsgData({ ...msgData, reply: '' });
                getCommentList();
            }
        }
    }

    const onSendMsgClick = () => {
        if (msgData.reply !== '') {
            sendComment()
        }
    }

    const ChatItem = (props) => {
        const { chatData, index, openOptionsIndex, setOpenOptionsIndex } = props;

        const isDropdownOpen = openOptionsIndex === index;



        const handleDropdownClick = (e) => {
            e.stopPropagation();
            setOpenOptionsIndex(isDropdownOpen ? null : index);
        };

        const handleEditClick = () => {
            // edit functionality 
        };

        const handleDeleteClick = () => {
            // delete functionality 
        };

        return (
            <div className="mt-4 " onClick={() => setOpenOptionsIndex(null)}>

                {index === 0 ?
                    <p className="text-sm text-gray-600 text-center">
                        {moment(chatData.created_at).format("DD/MM/YYYY")}
                    </p>
                    : formatDate(chatData.created_at, "DD/MM/YYYY") !== formatDate(chatList[index - 1].created_at, "DD/MM/YYYY") ?
                        <p className="text-sm text-gray-600 text-center">
                            {moment(chatData.created_at).format("DD/MM/YYYY")}
                        </p> : null
                }

                {user_id !== chatData.comment_by_id ?
                    <div className="flex flex-row relative">
                        <div onClick={handleDropdownClick} className="transition-all transform translate-y-8 opacity-0 hover:opacity-100 hover:translate-y-0 cursor-pointer">
                            <FaAngleDown
                                size={20}
                                color="#949699"
                                //fixing the dropdown symbol at the top right corner
                                className="absolute top-0 right-0 hover:backdrop-blur-xl shadow-lg p-5"
                            />
                        </div>

                        <div class="bubble">
                            <span className="text-sm px-2 font-medium text-gray-500">
                                {chatData.comment_by_name}
                            </span>

                            <p className="px-2 text-sm break-all">
                                {chatData.comment.split('<br>').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>

                            <span className="flex justify-end text-xs text-gray-500 pr-3">
                                {moment(chatData.created_at).format("HH:mm")}
                            </span>

                            {isDropdownOpen && (
                                <div className="options-dropdown">
                                    <ul>
                                        <li onClick={handleEditClick}>Edit</li>
                                        <li onClick={handleDeleteClick}>Delete</li>
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>
                    :
                    <div className="flex flex-row justify-end">

                        <div class="bubble2">
                            <div onClick={handleDropdownClick} className="transition-all transform translate-y-8 opacity-0 hover:opacity-100 hover:translate-y-0 cursor-pointer">
                                <FaAngleDown
                                    size={20}
                                    color="#949699"
                                    //Fixing the dropdown symbol to the top right corner
                                    className="absolute top-0 right-0 hover:backdrop-blur-xl shadow-lg"
                                />

                            </div>

                            <p className="px-2 text-sm break-all">
                                {chatData.comment.split('<br>').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>

                            <span className="flex justify-end text-xs text-gray-500 px-2">
                                {moment(chatData.created_at).format("HH:mm")}
                            </span>

                            {isDropdownOpen && (
                                <div className="options-dropdown mt-3">
                                    <ul>
                                        <li
                                            onClick={handleEditClick}
                                            className="text-xs font-quicksand"
                                        >
                                            Edit
                                        </li>
                                        <li onClick={handleDeleteClick}
                                            className="text-xs font-quicksand"
                                        >
                                            Delete
                                        </li>
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>
                }
            </div>
        );
    };


    return (
        <div className={`custom-modal-dialog ${showModal ? 'show' : ''}`} role="document">
            <div className="">
                <div className="flex flex-row justify-between">
                    <span className="text-xl">#Comments</span>
                    <svg fill="none" viewBox="0 0 24 24" className="cursor-pointer" height="1.5em" width="1.5em" onClick={() => {
                        setShowModal(!showModal)
                    }
                    }
                    >
                        <path
                            fill="currentColor"
                            d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
                        />
                    </svg>
                </div>
                <div id="element" className="no-scrollbar overflow-y-auto overflow-x-hidden pr-1 " style={{ height: 'calc(100vh - 250px)', scrollbarWidth: 'none' }} >
                    {chatList.map((item, index) => (
                        <ChatItem
                            chatData={item}
                            index={index}
                            key={item.id}
                            openOptionsIndex={openOptionsIndex}
                            setOpenOptionsIndex={setOpenOptionsIndex}

                        />
                    ))}
                    {chatList.length == 0 &&
                        <p className="flex justify-center mt-[35vh]">
                            No data found
                        </p>
                    }
                </div>

            </div>

            <div className="absolute bottom-2 right-2 left-2">
                <div className="flex flex-row justify-between items-between w-full">
                    <div className="flex w-full">
                        <textarea
                            value={msgData.reply}
                            id={"replyInputBox"}
                            ref={textFieldRef}
                            className={' text-justify w-full rounded-md border-transparent no-scrollbar break-all '}
                            placeholder="Write your comment..."
                            type="text"
                            // multiple
                            onChange={e => {
                                // console.log("nativeEvent", e.nativeEvent);
                                // Destructure and update msgData
                                setMsgData({ ...msgData, reply: e.target.value });
                                console.log("msgData ===>", msgData.reply);

                                // Check for the condition
                                // if (e.target.value.includes("/") && e.nativeEvent.inputType === "insertFromPaste") {
                                //     console.log("IN IF");
                                //     // setInputValue("");
                                //     textFieldRef.current.value = null;
                                //     // onType();
                                // } else {
                                //     console.log("IN ELSE");
                                //     // setInputValue(e.target.value);
                                //     // onType();
                                // }
                            }}

                            // onChange={(e) => { setMsgData({ ...msgData, reply: e.target.value }) }}
                            style={{
                                maxHeight: 240,
                                minHeight: MIN_TEXTAREA_HEIGHT,
                                resize: "none",
                                verticalAlign: 'center'
                            }}

                            // onKeyDown={(e) => {
                            //     if (e.key === 'Enter' && e.target.value) {
                            //         onSendMsgClick()                                    // 
                            //         setTimeout(() => {
                            //             textFieldRef.current.style.height = "32px";
                            //             textFieldRef.current.value = "";
                            //         }, 50)
                            //     }
                            // }}

                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value) {
                                    if (!e.shiftKey) {
                                        e.preventDefault(); // Prevent default behavior (submit)
                                        onSendMsgClick();
                                        textFieldRef.current.style.height = "32px";
                                        textFieldRef.current.value = "";
                                    }
                                }
                            }}
                        ></textarea>
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
