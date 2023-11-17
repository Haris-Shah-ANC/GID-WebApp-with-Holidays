import React, { useEffect, useState, useContext, useLayoutEffect, useRef } from "react";
import { getAddCommentUrl, getCommentListUrl, getDeleteCommentUrl, getEditCommentUrl } from "../../../api/urls";
import { useNavigate } from "react-router-dom";
import * as Actions from '../../../state/Actions';
import { apiAction } from "../../../api/api";
import { getLoginDetails, getWorkspaceInfo } from "../../../config/cookiesInfo";
import moment from "moment";
import { formatDate, notifySuccessMessage } from "../../../utils/Utils";
import CustomLabel from '../Elements/CustomLabel'
import ModalForCommentsOperations from "./ModalForComments";

export default function CommentsSideBar(props) {
    const { showModal, setShowModal, taskData } = props;
    const [msgData, setMsgData] = useState({ reply: "" })
    const [chatList, setChatData] = useState([])
    const [openOptionsIndex, setOpenOptionsIndex] = useState(null); // State to track open options in comment section
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const { work_id } = getWorkspaceInfo();
    const { user_id } = getLoginDetails(useNavigate());
    let MIN_TEXTAREA_HEIGHT = 50;
    const textFieldRef = useRef(null)

    // state to track the data of the comment whose dropdown options are currently open
    const [currentCommentData, setCurrentCommentData] = useState("");

    // state for opening and closing of edit modal
    const [openEditModal, setOpenEditModal] = useState(false);

    // state for opening and closing of delete modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // state for opening and closing of reply modal
    const [openReplyModal, setOpenReplyModal] = useState(false);

    useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textFieldRef.current.style.height = "50px";
        //Set height
        textFieldRef.current.style.height = `${Math.max(
            textFieldRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [msgData.reply]);

    useEffect(() => {
        getCommentList()
    }, [taskData])

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

            let newMsgData = msgData.reply.trim();
            newMsgData.replace(/\n/g, '<br>');

            // Replace line breaks with <br> tags when sending the message
            const messageWithLineBreaks = newMsgData.replace(/\n/g, '<br>');

            console.log("messageWithLineBreaks==>", messageWithLineBreaks)

            let res = await apiAction({
                url: getAddCommentUrl(),
                method: 'post',
                data: { workspace_id: work_id, task_id: taskData.id, comment: messageWithLineBreaks },
                navigate: navigate,
                dispatch: dispatch
            });

            if (res && res.success) {
                setMsgData({ ...msgData, reply: '' });
                // getCommentList();
                setChatData([...chatList, res.result])
                console.log("word_id==>", work_id)
            }
        }
    }

    const onSendMsgClick = () => {
        if (msgData.reply.trim() !== '') {
            sendComment()
        }
    }

    const Linkify = ({ children }) => {
        const isUrl = word => {
            const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
            return word.match(urlPattern)
        }

        const addMarkup = word => {
            return isUrl(word) ?
                `<a target="blank" class="text-blue-700" href="${word}">${word}</a>` :
                word
        }
        const words = children.split(' ')
        const formatedWords = words.map((w, i) => addMarkup(w))
        const html = formatedWords.join(' ')
        return (
            <p className="px-2 text-sm overflow-hidden break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html }}></p>
        )
    }

    const DropdownOptions = (props) => {

        const { commentType } = props;
        const dropDownClasess = `text-xs font-quicksand`;
        const deleteClass = `text-xs font-quicksand text-red-500`;

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
                            onClick={() => setOpenReplyModal(true)}
                            className="text-xs font-quicksand"
                        >
                            <CustomLabel label={'Reply'} className={dropDownClasess} />
                        </li>
                    }

                </ul>
            </div>
        )
    }

    function DeleteModal() {
        // const wrapperRef = useRef(null);

        ///////////////////////

        let url = getDeleteCommentUrl();

        function onSuccess(res) {
            notifySuccessMessage(res.status)
            let indexToDelete = chatList.findIndex((item) => item.id === currentCommentData.id)
            // console.log("indexToDelete==>", indexToDelete);
            chatList.splice(indexToDelete, 1)
            setOpenDeleteModal(false)
        }

        //////////////////////

        // useOutsideClickTracker(wrapperRef);

        // function useOutsideClickTracker(ref) {
        //     useEffect(() => {
        //         // close modal if clicked outside 
        //         function handleClickOutside(event) {
        //             if (ref.current && !ref.current.contains(event.target)) {
        //                 setOpenDeleteModal(false)
        //             }
        //         }
        //         // Bind the event listener
        //         document.addEventListener("mousedown", handleClickOutside);
        //         return () => {
        //             // Unbind the event listener on clean up
        //             document.removeEventListener("mousedown", handleClickOutside);
        //         };
        //     }, [ref]);
        // }

        // const deleteComment = async () => {
        //     let res = await apiAction({ url: getDeleteCommentUrl(), method: 'post', data: { comment_id: currentCommentData.id, } })

        //     if (res) {
        //         notifySuccessMessage(res.status)
        //         let indexToDelete = chatList.findIndex((item) => item.id === currentCommentData.id)
        //         // console.log("indexToDelete==>", indexToDelete);
        //         chatList.splice(indexToDelete, 1)
        //         setOpenDeleteModal(false)
        //     }
        // }

        return (
            <>
                {/* <div ref={wrapperRef} className="center p-5" style={{ width: 400, zIndex: 5 }}>
                    <div className="bg-white rounded shadow p-2">
                        <h3 className="text-black font-quicksand text-lg font-semibold">
                            {'Delete Comment ?'}
                        </h3>

                        <div className="flex justify-end gap-4">
                            <PlainButton title={"Cancel"} onButtonClick={() => setOpenDeleteModal(false)} className={"bg-blue-400 hover:bg-blue-500 text-white px-2.5 py-1.5"} disable={false} />
                            <PlainButton title={"Delete"} onButtonClick={deleteComment} className={"bg-red-400 hover:bg-red-500 text-white px-2.5 py-1.5"} disable={false} />
                        </div>

                    </div>
                </div> */}
                <ModalForCommentsOperations currentCommentData={currentCommentData} url={url} onSuccess={onSuccess} setOpenModal={setOpenDeleteModal} ModalType={"Delete"} />
            </>
        );
    }

    function EditModal(props) {
        // const { onClose, } = props;

        // const [text, setText] = useState(currentCommentData.comment)
        // const [initialTextareaText, setInitialTextareaText] = useState(''); // State to conditionally render the code inside the useLayoutEffect as it was running before the textarea was rendered
        // const editCommentRef = useRef(null);
        // let textareaHeight = 70;

        // let chatMessage = text.replaceAll("<br>", "\n")

        // useLayoutEffect(() => {
        //     const end = editCommentRef.current.value.length;
        //     editCommentRef.current.focus()
        //     editCommentRef.current.setSelectionRange(end, end)
        //     if (initialTextareaText.length !== 0) {
        //         // Reset height - important to shrink on delete
        //         editCommentRef.current.style.height = "50px";
        //         //Set height
        //         editCommentRef.current.style.height = `${Math.max(
        //             editCommentRef.current.scrollHeight,
        //             textareaHeight
        //         )}px`;
        //     }
        // }, [editCommentRef, textareaHeight, initialTextareaText]);

        ///////////////////////////

        let url = getEditCommentUrl();
        let data = { comment_id: currentCommentData.id }

        function onSuccess(res, comment) {
            notifySuccessMessage(res.status)

            chatList.map((data) => {
                if (data.id === currentCommentData.id) {
                    // console.log("ID to update", data.comment)
                    data.comment = comment
                    // console.log("after changing==>", data.comment)
                }
            })
            setOpenEditModal(false)
        }

        /////////////////
        // For Editing the Comment 

        // const editComment = async () => {
        //     if (text !== '') {
        //         // Replace line breaks with <br> tags when sending the message
        //         const commentWithLineBreaks = text.replace(/\n/g, '<br>');
        //         // console.log("inside editComment===>", commentWithLineBreaks)

        //         let res = await apiAction({
        //             url: getEditCommentUrl(), method: 'post', data: {
        //                 comment_id: currentCommentData.id,
        //                 comment: commentWithLineBreaks
        //             }
        //         })

        //         if (res) {
        //             notifySuccessMessage(res.status)
        //             // getCommentList()
        //             chatList.map((data) => {
        //                 if (data.id === currentCommentData.id) {
        //                     // console.log("ID to update", data.comment)
        //                     data.comment = commentWithLineBreaks
        //                     // console.log("after changing==>", data.comment)
        //                 }
        //             })
        //             setOpenEditModal(false)
        //         }
        //     }
        // }
        ////////////////    

        // function useOutsideClickTracker(ref) {
        //     useEffect(() => {
        //         // close modal if clicked outside 
        //         function handleClickOutside(event) {
        //             if (ref.current && !ref.current.contains(event.target)) {
        //                 setOpenEditModal(false)
        //             }
        //         }
        //         // Bind the event listener
        //         document.addEventListener("mousedown", handleClickOutside);
        //         return () => {
        //             // Unbind the event listener on clean up
        //             document.removeEventListener("mousedown", handleClickOutside);
        //         };
        //     }, [ref]);
        // }

        // const wrapperRef = useRef(null);
        // useOutsideClickTracker(wrapperRef);

        return (
            <>
                <>
                    {/* <div className="center p-5" style={{ width: 400, zIndex: 5 }} onClose={onClose} ref={wrapperRef}>
                    <div className="bg-gray-100 rounded shadow">
                        <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                            <h3 className="text-lg font-quicksand font-bold text-center w-full">
                                {'Edit Comment'}
                            </h3>

                        </div>

                        <div className="relative px-5 pt-2 flex-auto">
                            <div className="my-4 flex flex-col">
                                
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
                                    className={"text-justify w-full rounded-md border-transparent no-scrollbar break-words"}
                                    onChange={(e) => {
                                        setText(e.target.value);
                                        setInitialTextareaText(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            if (!e.shiftKey) {
                                                // editComment()
                                                e.preventDefault(); // Prevent default behavior (submit)
                                            }
                                        }
                                    }}
                                >
                                </textarea>
                            </div>

                        </div>

                        <div className=" flex justify-end gap-4 pb-5 pr-5 pt-1">
                            <PlainButton title={"Cancel"} onButtonClick={onClose} className={"bg-white text-blue-500 hover:bg-blue-100 px-2.5 py-1.5"} disable={false} />
                            <PlainButton title={"Save"} onButtonClick={editComment} className={"px-2.5 py-1.5"} disable={false} />
                        </div>

                    </div>
                </div> */}
                </>
                <ModalForCommentsOperations currentCommentData={currentCommentData} url={url} data={data} onSuccess={onSuccess} openModal={openEditModal} setOpenModal={setOpenEditModal} ModalType={"Edit"} />
            </>
        );
    }

    function ReplyModal(props) {
        // const { onClose } = props;
        // const wrapperRef = useRef(null);
        // const replyInputRef = useRef(null)
        // const [initialTextareaText, setInitialTextareaText] = useState('');
        // useOutsideClickTracker(wrapperRef);
        // let textareaHeight = 70;


        // let commentReplyingTo = currentCommentData.comment.replaceAll("<br>", "\n")

        ///////// data for Api Calls

        const url = getAddCommentUrl();
        const data = {
            workspace_id: work_id,
            task_id: taskData.id,
            reply_to_id: currentCommentData.id
        }

        function onSuccess(res) {
            notifySuccessMessage(res.status);
            setChatData([...chatList, res.result])
            setOpenReplyModal(false)
        }

        ////////////////////////////////////

        // useLayoutEffect(() => {
        //     const end = replyInputRef.current.value.length;
        //     replyInputRef.current.focus()
        //     replyInputRef.current.setSelectionRange(end, end)
        //     if (initialTextareaText.length !== 0) {
        //         // Reset height - important to shrink on delete
        //         replyInputRef.current.style.height = "50px";
        //         //Set height
        //         replyInputRef.current.style.height = `${Math.max(
        //             replyInputRef.current.scrollHeight,
        //             textareaHeight
        //         )}px`;
        //     }
        // }, [replyInputRef, textareaHeight, initialTextareaText]);

        // function useOutsideClickTracker(ref) {
        //     useEffect(() => {
        //         // close modal if clicked outside 
        //         function handleClickOutside(event) {
        //             if (ref.current && !ref.current.contains(event.target)) {
        //                 setOpenReplyModal(false)
        //             }
        //         }
        //         // Bind the event listener
        //         document.addEventListener("mousedown", handleClickOutside);
        //         return () => {
        //             // Unbind the event listener on clean up
        //             document.removeEventListener("mousedown", handleClickOutside);
        //         };
        //     }, [ref]);
        // }

        // useLayoutEffect(() => {
        //     const end = replyInputRef.current.value.length;
        //     replyInputRef.current.focus()
        //     replyInputRef.current.setSelectionRange(end, end)
        //     if (initialTextareaText.length !== 0) {
        //         // Reset height - important to shrink on delete
        //         replyInputRef.current.style.height = "50px";
        //         //Set height
        //         replyInputRef.current.style.height = `${Math.max(
        //             replyInputRef.current.scrollHeight,
        //             textareaHeight
        //         )}px`;
        //     }
        // }, [replyInputRef, textareaHeight, initialTextareaText]);

        // function useOutsideClickTracker(ref) {
        //     useEffect(() => {
        //         // close modal if clicked outside 
        //         function handleClickOutside(event) {
        //             if (ref.current && !ref.current.contains(event.target)) {
        //                 setOpenReplyModal(false)
        //             }
        //         }
        //         // Bind the event listener
        //         document.addEventListener("mousedown", handleClickOutside);
        //         return () => {
        //             // Unbind the event listener on clean up
        //             document.removeEventListener("mousedown", handleClickOutside);
        //         };
        //     }, [ref]);
        // }


        // const replyToComment = async () => {
        //     if (initialTextareaText !== '') {
        //         const commentWithLineBreaks = initialTextareaText.replace(/\n/g, '<br>');

        //         let res = await apiAction({
        //             url: getAddCommentUrl(), method: 'post', data: {
        //                 workspace_id: work_id,
        //                 task_id: taskData.id,
        //                 comment: commentWithLineBreaks,
        //                 reply_to_id: currentCommentData.id
        //             },
        //         })
        //         if (res) {
        //             notifySuccessMessage(res.status)
        //             // getCommentList()
        //             setChatData([...chatList, res.result])
        //         }
        //         setOpenReplyModal(false);
        //     }
        // }

        return (
            <>
                {/* <div className="center p-3" style={{ width: 400, zIndex: 5 }} ref={wrapperRef}>
                    <div className="bg-gray-100 rounded shadow">
                        <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                            <h3 className="text-lg font-quicksand font-bold text-center w-full">
                                {'Reply'}
                            </h3>
                        </div>
                        <div className="relative px-3 pt-2">
                            <div className="my-4 flex flex-col">

                                <div className="bg-gray-300 mx-1 px-1 mb-1 rounded flex flex-row">
                                    <div className="w-1 bg-blue-500 rounded-tl-lg rounded-bl-lg "></div>
                                    <div className="overflow-hidden py-2">
                                        <p className="px-2 text-sm font-semibold text-blue-400 overflow-hidden break-words">{currentCommentData.comment_by_name}</p>
                                        <p className="px-2 text-sm overflow-hidden break-words">
                                            <Linkify>
                                                {currentCommentData.comment}
                                            </Linkify>
                                        </p>
                                    </div>


            <div className="center p-3" style={{ width: 400, zIndex: 5 }} ref={wrapperRef}>
                <div className="bg-gray-100 rounded shadow">
                    <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                        <h3 className="text-lg font-quicksand font-bold text-center w-full">
                            {'Reply'}
                        </h3>
                    </div>
                    <div className="relative px-3 pt-2">
                        <div className="my-4 flex flex-col">

                            <div className="bg-gray-300 mx-1 px-1 mb-1 rounded flex flex-row">
                                <div className="w-1 bg-blue-500 rounded-tl-lg rounded-bl-lg "></div>
                                <div className="overflow-hidden py-2">
                                    <p className="px-2 text-sm font-semibold text-blue-400 overflow-hidden break-all">{currentCommentData.comment_by_name}</p>
                                    <p className="px-2 text-sm overflow-hidden break-all">
                                        <Linkify>
                                            {currentCommentData.comment}
                                        </Linkify>
                                    </p>

                                </div>

                                <textarea
                                    style={{
                                        maxHeight: 240,
                                        minHeight: textareaHeight,
                                        resize: "none",
                                        verticalAlign: 'center'
                                    }}
                                    ref={replyInputRef}
                                    disable={true}
                                    className={"text-justify w-full rounded-md border-transparent no-scrollbar break-words mt-2"}
                                    onChange={(e) => { setInitialTextareaText(e.target.value); }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            if (!e.shiftKey) {
                                                e.preventDefault(); // Prevent default behavior (submit)
                                            }
                                        }
                                    }}
                                >
                                </textarea>
                            </div>

                        </div>

                        <div className=" flex justify-end gap-4 pb-3 mt-3 pr-5">
                            <PlainButton title={"Cancel"} onButtonClick={onClose} className={"bg-white hover:bg-blue-100 text-blue-500 px-2.5 py-1.5"} disable={false} />
                            <PlainButton title={"Send"}
                                onButtonClick={replyToComment}
                                className={" px-2.5 py-1.5"} disable={false} />
                        </div>
                    </div>
                </div> */}

                <ModalForCommentsOperations currentCommentData={currentCommentData} url={url} data={data} onSuccess={onSuccess}
                    Linkify={Linkify} openModal={openReplyModal} setOpenModal={setOpenReplyModal}
                    ModalType={"Reply"} />
            </>
        )
    }

    const ChatItem = (props) => {
        const { chatData, index, openOptionsIndex, setOpenOptionsIndex } = props;

        // console.log("chatData.is_reply===>", chatData.is_reply)
        const commentTypes = { self: "self", reply: "reply" }

        let isDropdownOpen = openOptionsIndex === index;

        // Classes to apply CSS based on the value of isDropdownOpen for making the dropdown visible until the dropdown options are not closed

        const isOptionsOpen = `transition-all transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer`;
        const isOptionsClosed = `opacity-100 cursor-pointer translate-y-0`;

        const handleDropdownClick = (e) => {
            console.log("inside handleDropdownClick==>", chatData)
            setCurrentCommentData(chatData)
            e.stopPropagation();
            setOpenOptionsIndex(isDropdownOpen ? null : index);
        };

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

                        <div class="bubble group">

                            <div className="flex flex-row justify-between">
                                <span className="text-sm px-2 font-medium text-gray-500 break-words">
                                    {chatData.comment_by_name}
                                </span>

                                <div onClick={handleDropdownClick}
                                    className={isDropdownOpen ? isOptionsClosed : isOptionsOpen}
                                >
                                    <i class="fa-solid fa-chevron-down fa-1x"
                                        style={{
                                            paddingRight: 10, color: "#949699", cursor: 'pointer',
                                        }}
                                    ></i>

                                </div>
                            </div>

                            {/* Show Replied Comments */}
                            {chatData.is_reply &&
                                <div className="bg-blue-200 py-1 mx-1 mb-1 rounded flex flex-row">
                                    <div className="w-1 bg-blue-500 rounded-tl-lg rounded-bl-lg "></div>
                                    <div>
                                        <p className="px-2 text-sm font-semibold text-blue-400 overflow-hidden break-words">
                                            {chatData.reply_to_user}
                                        </p>
                                        <p className=" text-sm overflow-hidden break-all">
                                            <Linkify>
                                                {chatData.reply_to_comment}
                                            </Linkify>
                                        </p>
                                    </div>
                                </div>
                            }


                            <Linkify>
                                {chatData.comment}
                            </Linkify>

                            {/* <p className="px-2 text-sm break-words">
                                {chatData.comment.split('<br>').map((line, index) => (
                                    <React.Fragment key={index}>
                                        <Linkify>{line}</Linkify>
                                        <br />

                            <p className="px-2 text-sm break-all">
                                {chatData.comment.split('<br>').map((line, index) => (
                                    <React.Fragment key={index}>
                                        <Linkify>{line}</Linkify>

                                    </React.Fragment>
                                ))}
                            </p> */}


                            <span className="flex justify-end text-xs text-gray-500 pr-3">
                                {moment(chatData.created_at).format("HH:mm")}
                            </span>

                            {isDropdownOpen && (
                                <DropdownOptions commentType={commentTypes.reply} />
                            )}

                        </div>
                    </div>
                    :
                    <div className="flex flex-row justify-end">
                        <div class="bubble2 group ">
                            <div
                                onClick={handleDropdownClick}
                                className={isDropdownOpen ? isOptionsClosed : isOptionsOpen}
                            >
                                <p className=" bubble2-icon">
                                    <i class="fa-solid fa-chevron-down fa-1x"
                                        style={{
                                            paddingRight: 2,
                                            paddingLeft: 2,
                                            color: "#949699", position: 'absolute', top: '0', right: '0',
                                        }}
                                    > </i>
                                </p>
                            </div>

                            {/* Show Replied Comments */}
                            {chatData.is_reply &&
                                <div className="bg-blue-200 py-1 mx-1 mb-1 rounded flex flex-row">
                                    <div className="w-1 bg-blue-500 rounded-tl-lg rounded-bl-lg"></div>
                                    <div>

                                        {/* <p className="px-2 text-sm font-semibold text-blue-400 overflow-hidden break-words">
                                            {chatData.reply_to_user}
                                        </p>
                                        <p className=" text-sm overflow-hidden break-all"> */}

                                        <p className="px-2 text-sm font-semibold text-blue-400 overflow-hidden break-all">
                                            {chatData.reply_to_user}
                                        </p>
                                        <p className="px-0 text-sm overflow-hidden break-all">

                                            <Linkify>
                                                {chatData.reply_to_comment}
                                            </Linkify>
                                        </p>
                                    </div>
                                </div>
                            }

                            {/* {console.log("chatData.comment==>", currentCommentData.comment)} */}
                            {/* <pre className="font-quicksand"> */}
                            <Linkify>
                                {chatData.comment}
                            </Linkify>
                            {/* </pre> */}

                            {/* <p className="px-2 text-sm break-words">
                                {chatData.comment.split('<br>').map((line, index) => (
                                    <React.Fragment key={index}>
                                        <Linkify>{line}</Linkify>
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p> */}

                            <span className="flex justify-end text-xs text-gray-500 px-2">
                                {/* {(chatData.comment === chatData.currentComment) &&
                                    <b> {`edited`} </b>} */}
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

    //////// for resizing the comment Modal
    const mainRef = useRef(null);
    const refLeft = useRef(null);

    useEffect(() => {

        const resizeableEle = mainRef.current;
        const styles = window.getComputedStyle(resizeableEle);
        let width = parseInt(styles.width, 10);
        let x = 0;

        // resizeableEle.style.top = "50px";
        // resizeableEle.style.left = "50px";

        // Left resize
        const onMouseMoveLeftResize = (event) => {
            const dx = event.clientX - x;
            x = event.clientX;
            width = width - dx;
            resizeableEle.style.width = `${width}px`;
        };

        const onMouseUpLeftResize = (event) => {
            document.removeEventListener("mousemove", onMouseMoveLeftResize);
        };

        const onMouseDownLeftResize = (event) => {
            x = event.clientX;
            resizeableEle.style.right = styles.right;
            resizeableEle.style.left = null;
            document.addEventListener("mousemove", onMouseMoveLeftResize);
            document.addEventListener("mouseup", onMouseUpLeftResize);
        };

        // Add mouse down event listener
        const resizerLeft = refLeft.current;
        resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

        return () => {
            resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
        };
    }, []);

    return (
        <div className="container ">
            <div className={`custom-modal-dialog ${showModal ? 'show' : ''}`} role="document"
                onClick={(e) => setOpenOptionsIndex(false)} // for closing dropdown Options
                ref={mainRef}
            >
                {/* select-none prevents users from selecting anything while resizing the modal */}
                <div className="resizer resizer-l select-none" ref={refLeft}> </div>

                {/* <div className="relative"> */}
                {/* <div className="center h-12 bg-green-400" style={{}}></div> */}
                {/* </div> */}
                {openDeleteModal && <DeleteModal />}
                {openEditModal && <EditModal onClose={() => setOpenEditModal(false)} />}
                {openReplyModal && <ReplyModal onClose={() => setOpenReplyModal(false)} />}

                <div
                // className="resizer resizer-l" ref={refLeft}
                >
                    {/* <div className="relative">
                </div> */}
                    <div className="flex flex-row justify-between">
                        <span className="text-xl ml-3 z-10">#Comments</span>
                        <svg fill="none" viewBox="0 0 24 24" className="cursor-pointer" height="1.5em" width="1.5em" onClick={() => {
                            setShowModal(false)
                        }}
                        >
                            <path
                                fill="currentColor"
                                d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
                            />
                        </svg>
                    </div>
                    <div id="element" className="no-scrollbar overflow-y-auto overflow-x-hidden pr-1" style={{ height: 'calc(100vh - 250px)', scrollbarWidth: 'none' }} >
                        {chatList.map((item, index) => (<ChatItem chatData={item} index={index} openOptionsIndex={openOptionsIndex} setOpenOptionsIndex={setOpenOptionsIndex} />))}
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
                                value={msgData.reply}
                                id={"replyInputBox"}
                                ref={textFieldRef}
                                className={'text-justify w-full rounded-md border-transparent no-scrollbar break-words'}
                                placeholder="Write your comment..."
                                type="text"
                                // multiple
                                onChange={e => {
                                    // Destructure and update msgData
                                    if (e.target.value !== " ") {
                                        setMsgData({ ...msgData, reply: e.target.value });
                                    }
                                    // Check for the condition
                                    // if (e.target.value.includes("/") && e.nativeEvent.inputType === "insertFromPaste") {
                                    //     textFieldRef.current.value = null;
                                    // } else {
                                    // setInputValue(e.target.value);
                                    // onType();
                                    // }
                                }}

                                // onChange={(e) => { setMsgData({ ...msgData, reply: e.target.value }) }}
                                style={{
                                    maxHeight: 120,
                                    minHeight: MIN_TEXTAREA_HEIGHT,
                                    resize: "none",
                                    verticalAlign: 'center'
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value !== " ") {
                                        if (!e.shiftKey) {
                                            e.preventDefault(); // Prevent default behavior (submit)
                                            onSendMsgClick();
                                            textFieldRef.current.style.height = "32px";
                                            textFieldRef.current.value = "";
                                        }
                                    }
                                }}
                            />
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
        </div>
    );
}