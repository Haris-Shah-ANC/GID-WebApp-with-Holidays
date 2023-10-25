import React, { useEffect, useState, useContext, useLayoutEffect, useRef } from "react";
import { getAddCommentUrl, getCommentListUrl, getDeleteCommentUrl, getEditCommentUrl } from "../../../api/urls";
import { useNavigate } from "react-router-dom";
import * as Actions from '../../../state/Actions';
import { apiAction } from "../../../api/api";
import { getLoginDetails, getWorkspaceInfo } from "../../../config/cookiesInfo";
import moment from "moment";
import { formatDate, notifySuccessMessage } from "../../../utils/Utils";
import CustomLabel from "../Elements/CustomLabel";
import { Box, Modal } from '@mui/material';
import PlainButton from "../Elements/buttons/PlainButton";
import ButtonWithImage from "../Elements/buttons/ButtonWithImage";
import { chart } from "highcharts";

export default function CommentsSideBar(props) {
    const { showModal, setShowModal, taskData } = props;
    const [msgData, setMsgData] = useState({ reply: "" })
    const [chatList, setChatData] = useState([]);
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const { work_id } = getWorkspaceInfo();
    const { user_id } = getLoginDetails(useNavigate());

    // state to track the id of the comment whose dropdown options are currently open
    const [currentCommentId, setCurrentCommentId] = useState(null)

    //state to track the text message of the comment whose dropdown options are currently open
    const [currentCommentText, setCurrentCommentText] = useState("");

    // state for opening and closing of edit modal
    const [openEditModal, setOpenEditModal] = useState(false);

    // state for opening and closing of delete modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // State to track open options in comment section
    const [openOptionsIndex, setOpenOptionsIndex] = useState(null);

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
            // console.log("inside SendComment===>", messageWithLineBreaks)

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

        // console.log("chatData===>", chatData)
        const commentTypes = { self: "self", reply: "reply" }

        let isDropdownOpen = openOptionsIndex === index;

        // Classes to apply CSS based on the value of isDropdownOpen for making the dropdown visible until the dropdown options are not closed
        const isOptionsOpen = `transition-all transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer`;
        const isOptionsClosed = `opacity-100 cursor-pointer translate-y-0`;


        const handleDropdownClick = (e) => {
            console.log("inside handleDropdownClick==>", chatData)
            setCurrentCommentId(chatData.id)
            setCurrentCommentText(chatData.comment)
            e.stopPropagation();
            setOpenOptionsIndex(isDropdownOpen ? null : index);
        };

        const handleReplyClick = () => {
            //Reply functionality
        }

        return (
            <div className="mt-4" onClick={() => setOpenOptionsIndex(null)}>

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

                        <div class="bubble group ">

                            <div className="flex flex-row justify-between">
                                <span className="text-sm px-2 font-medium text-gray-500 break-all">
                                    {chatData.comment_by_name}
                                </span>

                                {/* <div onClick={handleDropdownClick}
                                    // ref={wrapperRef}
                                    // className="transition-all transform translate-y-8 opacity-0 group-hover:opacity-100 "
                                    className={isDropdownOpen ? isOptionsClosed : isOptionsOpen}
                                >
                                    <i class="fa-solid fa-chevron-down fa-1x"
                                        style={{
                                            paddingRight: 5, color: "#949699", cursor: 'pointer',
                                        }}
                                    ></i> */}
                                {/* <FaAngleDown
                                        size={20}
                                        color="#949699"
                                        //fixing the dropdown symbol at the top right corner
                                        className=" top-0 right-0 backdrop-blur-xl "
                                    /> */}
                                {/* </div> */}
                            </div>

                            <p className="px-2 text-sm break-all" >
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
                                <DropdownOptions commentType={commentTypes.reply} handleReplyClick={handleReplyClick} />
                            )}

                        </div>
                    </div>
                    :
                    <div className="flex flex-row justify-end">

                        <div class="bubble2 group "
                        // id='parent-bubble2' // for making child element visible on hover using Vanilla CSS
                        >
                            <div
                                // class="AngleDown-hidden-bubble2" 
                                onClick={handleDropdownClick}
                                // className="transition-all transform translate-y-8 opacity-0 group-hover:opacity-100 bg-black"
                                className={isDropdownOpen ? isOptionsClosed : isOptionsOpen}
                            >
                                <p className="bubble2-icon">
                                    <i class="fa-solid fa-chevron-down fa-1x"
                                        style={{
                                            paddingRight: 2,
                                            paddingLeft: 2,
                                            color: "#949699", position: 'absolute', top: '0', right: '0',
                                        }}
                                    ></i>
                                </p>
                                {/* <FaAngleDown
                                    size={20}
                                    color="#949699"
                                    //Fixing the dropdown symbol to the top right corner
                                    className="absolute top-0 right-0 backdrop-blur-xl shadow-lg"
                                /> */}
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
                                {(chatData.comment === chatData.currentComment) &&
                                    <b> {`edited`} </b>}
                                {moment(chatData.created_at).format("HH:mm")}
                            </span>

                            {isDropdownOpen && (
                                <DropdownOptions commentType={commentTypes.self} />
                            )}

                        </div>
                    </div>
                }
            </div>
        );
    };

    const DropdownOptions = (props) => {

        const { commentType, handleReplyClick } = props;
        const dropDownClasess = `text-xs font-quicksand`;
        const deleteClass = `text-xs font-quicksand text-red-500`

        return (
            <div className="options-dropdown mt-3">
                <ul>
                    {commentType === "self" ?
                        <>
                            <li
                                onClick={() => setOpenEditModal(true)}
                                className="text-xs font-quicksand"
                            >
                                <CustomLabel label={'Edit'} className={dropDownClasess} />
                            </li>
                            <li onClick={() => setOpenDeleteModal(true)}
                                className="text-xs font-quicksand text-red-500"
                            >
                                <CustomLabel label={'Delete'} className={deleteClass} />
                            </li>
                        </>
                        :
                        <li
                            onClick={handleReplyClick}
                            className="text-xs font-quicksand"
                        >
                            <CustomLabel label={'Reply'} className={dropDownClasess} />
                        </li>
                    }

                </ul>
            </div>
        )
    }

    function EditModal(props) {

        const { open, onClose, currentCommentText } = props;

        // console.log("Inside EditModal===>", open)
        const [text, setText] = useState(currentCommentText)
        const [initialTextareaText, setInitialTextareaText] = useState(''); // State to conditionally render the code inside the useLayoutEffect as it was running before the textarea was rendered
        const editCommentRef = useRef(null);
        let textareaHeight = 70;

        const styleforEditModal = {
            position: 'absolute',
            top: '50%',
            // left: '87.5%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
        };


        let chatMessage = text.replaceAll("<br>", "\n")

        useLayoutEffect(() => {
            if (initialTextareaText.length !== 0) {
                // Reset height - important to shrink on delete
                editCommentRef.current.style.height = "50px";
                //Set height
                editCommentRef.current.style.height = `${Math.max(
                    editCommentRef.current.scrollHeight,
                    textareaHeight
                )}px`;
            }
        }, [editCommentRef, textareaHeight, initialTextareaText]);

        // For Editing the Comment 

        const editComment = async (id, comment) => {
            if (text !== '') {
                // Replace line breaks with <br> tags when sending the message
                const commentWithLineBreaks = text.replace(/\n/g, '<br>');
                // console.log("inside editComment===>", commentWithLineBreaks)

                let res = await apiAction({
                    url: getEditCommentUrl(), method: 'post', data: {
                        comment_id: id,
                        comment: commentWithLineBreaks
                    }
                })
                console.log("commentWithLineBreaks==>",commentWithLineBreaks);
                console.log("comment==>",comment)
                if (res && (comment !== commentWithLineBreaks)) { // show edited status only if the user made any changes to the comment
                    notifySuccessMessage(res.status)
                    // getCommentList()
                    chatList.map((data, index) => {
                        if (data.id === id) {
                            console.log("ID to update", data.comment)
                            data.comment = commentWithLineBreaks
                            console.log("after changing==>", data.comment)
                        }
                    })
                    setOpenEditModal(false)
                }
            }
        }
        ////////////////

        return (
            <div >
                {/* <Button onClick={handleOpen}>Open Child Modal</Button> */}
                <Modal
                    open={open}
                    onClose={onClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box
                        sx={{ ...styleforEditModal, width: 350 }}
                    >
                        <div className="bg-gray-200">
                            <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                                <h3 className="text-lg font-quicksand font-bold text-center w-full">
                                    {'Edit Comment'}
                                </h3>
                                <ButtonWithImage
                                    onButtonClick={onClose}
                                    title={""}
                                    className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                                    icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
                                ></ButtonWithImage>
                            </div>
                            <form>

                                <div className="relative px-5 pt-2 flex-auto">
                                    <div className="my-4 flex flex-col">
                                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Comment to Edit"} />
                                        <textarea
                                            style={{
                                                maxHeight: 240,
                                                minHeight: textareaHeight,
                                                resize: "none",
                                                verticalAlign: 'center'
                                            }}
                                            ref={editCommentRef}
                                            disable={true}
                                            value={chatMessage}
                                            className={"text-justify w-full rounded-md border-transparent no-scrollbar break-all "}
                                            onChange={(e) => {
                                                setText(e.target.value);
                                                setInitialTextareaText(e.target.value);
                                                console.log("editCommentTextarea==>", initialTextareaText)
                                                // if (e.target.value !== "")
                                                // setHolidayData({ ...holidayData, title: e.target.value })
                                            }}

                                        >
                                        </textarea>
                                    </div>

                                </div>


                                <div className="p-6 border-solid border-slate-200 rounded-b">
                                    <PlainButton
                                        title={"Submit Changes"}
                                        className={"w-full"}
                                        onButtonClick={() => { editComment(currentCommentId, text) }}
                                        disable={false}>
                                    </PlainButton>
                                </div>

                            </form>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }

    function DeleteModal(props) {
        const { open, setOpenDeleteModal, onClose, currentComment } = props;
        const style = {
            position: 'absolute',
            top: '50%',
            // left: '87.5%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
        };

        // For Deleting Comment

        const deleteComment = async (id) => {
            // console.log('inside deleteComment==>', id)
            let res = await apiAction({ url: getDeleteCommentUrl(), method: 'post', data: { comment_id: id, } })
            if (res) {
                notifySuccessMessage(res.status)
                getCommentList()
                setOpenDeleteModal(false)
            }
        }
        ////////////////////////////

        return (
            <div >
                <Modal
                    open={open}
                    onClose={onClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box
                        sx={{ ...style, width: 350 }}
                    >
                        <div className="bg-gray-300">
                            <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                                <h3 className="text-lg font-quicksand font-bold w-full">
                                    {'Delete message?'}
                                </h3>
                            </div>
                            <div className=" ml-44 pb-5 mt-9">
                                <button
                                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded-md mr-3"
                                    onMouseDown={onClose}
                                >Cancel
                                </button>
                                <button
                                    onClick={() => deleteComment(currentComment)}
                                    className="bg-red-400 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded-md"
                                >Delete
                                </button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className={`custom-modal-dialog ${showModal ? 'show' : ''}`} role="document"
                onClick={(e) => setOpenOptionsIndex(false)} // for closing dropdown Options
            >
                <div className="relative"
                >
                    <div className="relative">
                        <EditModal open={openEditModal} onClose={() => setOpenEditModal(false)} currentCommentText={currentCommentText} />
                        <DeleteModal open={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} onClose={() => setOpenDeleteModal(false)} currentComment={currentCommentId} />
                        {/* <DeleteModal showModal={openDeleteModal} setShowModal={setOpenDeleteModal} /> */}
                    </div>

                    <div className="flex flex-row justify-between ">
                        <span className="text-xl"> #Comments </span>
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
                        {chatList.length === 0 &&
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
                                onClick={(e) => setOpenOptionsIndex(false)} // for closing dropdown Options
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
                                    // console.log("msgData ===>", msgData.reply);

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
        </React.Fragment>
    );
}