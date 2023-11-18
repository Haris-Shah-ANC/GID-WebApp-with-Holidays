import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlainButton from "../Elements/buttons/PlainButton";
import { apiAction } from "../../../api/api";

const ModalForCommentsOperations = (props) => {

    const { currentCommentData, url, data, onSuccess, Linkify, openModal, setOpenModal, ModalType } = props;
    // console.table("PROPS", props)

    const [initialTextareaText, setInitialTextareaText] = useState(''); // State to conditionally render the code inside the useLayoutEffect as it was running before the textarea was rendered
    const wrapperRef = useRef(null);
    const commentRef = useRef(null);
    let textareaHeight = 70;
    useOutsideClickTracker(wrapperRef);

    // for Edit Modal
    const [text, setText] = useState(currentCommentData.comment)
    let chatMessage = text.replaceAll("<br>", "\n")

    useLayoutEffect(() => {
        if (ModalType !== "Delete") {
            // const end = commentRef.current.value.length;
            // commentRef.current.setSelectionRange(end, end)
            commentRef.current.focus()
            if (initialTextareaText.length !== 0) {
                // Reset height - important to shrink on delete
                commentRef.current.style.height = "50px";
                //Set height
                commentRef.current.style.height = `${Math.max(
                    commentRef.current.scrollHeight,
                    textareaHeight
                )}px`;
            }
        }
    }, [commentRef, textareaHeight, initialTextareaText,ModalType]);

    function useOutsideClickTracker(ref) {
        useEffect(() => {
            // close modal if clicked outside 
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setOpenModal(false)
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const replyToComment = async () => {
        if (initialTextareaText !== '') {
            const commentWithLineBreaks = initialTextareaText.replace(/\n/g, '<br>');

            let res = await apiAction({
                url: url, method: 'post', data: { ...data, comment: commentWithLineBreaks }
            })
            if (res) {
                onSuccess(res)
            }
        }
    }

    const editComment = async () => {
        if (text !== "") {
            const commentWithLineBreaks = text.replace(/\n/g, '<br>');

            let res = await apiAction({
                url: url, method: 'post', data: { ...data, comment: commentWithLineBreaks }
            })

            if (res) {
                onSuccess(res, commentWithLineBreaks)
            }
        }
    }

    const deleteComment = async (id) => {
        let res = await apiAction({
            url: url, method: 'post', data: {
                comment_id: id
            }
        })

        if (res) {
            onSuccess(res)
        }
    }

    return (
        <>
            {ModalType !== 'Delete' ?

                <div className="center p-3" style={{ width: 400, zIndex: 5 }} ref={wrapperRef}>
                    <div className="bg-gray-100 rounded shadow">
                        <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                            <h3 className="text-lg font-quicksand font-bold text-center w-full">
                                {ModalType === "Reply" ? ModalType : ModalType + " Comment"}
                            </h3>
                        </div>

                        <div className={ModalType === 'Reply' ? `relative px-3 pt-2` : `relative px-5 pt-2 flex-auto`} >
                            <div className="my-4 flex flex-col">

                                {ModalType === "Reply" &&
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
                                    </div>
                                }

                                <textarea
                                    style={{
                                        maxHeight: 240,
                                        minHeight: textareaHeight,
                                        resize: "none",
                                        verticalAlign: 'center'
                                    }}
                                    ref={commentRef}
                                    value={ModalType === "Reply" ? null : chatMessage}
                                    disable={true}
                                    className={"text-justify w-full rounded-md border-transparent no-scrollbar break-words mt-2"}
                                    onChange={(e) => { ModalType === "Reply" ? setInitialTextareaText(e.target.value) : setText(e.target.value); setInitialTextareaText(e.target.value); }}
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

                        <div className="flex justify-end gap-4 pb-3 mt-3 pr-5">
                            <PlainButton title={"Cancel"} onButtonClick={() => setOpenModal(false)} className={"bg-white hover:bg-blue-100 text-blue-500 px-2.5 py-1.5"} disable={false} />
                            <PlainButton title={ModalType === "Reply" ? "Send" : "Save"}
                                onButtonClick={ModalType === "Reply" ? replyToComment : editComment}
                                className={"px-2.5 py-1.5"} disable={false} />
                        </div>

                    </div>
                </div>
                :

                <div ref={wrapperRef} className="center p-5" style={{ width: 400, zIndex: 5 }}>

                    <div className="bg-white rounded shadow p-2">
                        <h3 className="text-black font-quicksand text-lg font-semibold">
                            {'Delete Comment ?'}
                        </h3>

                        <div className="flex justify-end gap-4">
                            <PlainButton title={"Cancel"} onButtonClick={() => setOpenModal(false)} className={"bg-blue-400 hover:bg-blue-500 text-white px-2.5 py-1.5"} disable={false} />
                            <PlainButton title={"Delete"}
                                onButtonClick={() => deleteComment(currentCommentData.id)}
                                className={"bg-red-400 hover:bg-red-500 text-white px-2.5 py-1.5"} disable={false} />
                        </div>

                    </div>
                </div>
            }
        </>
    )
}


export default ModalForCommentsOperations;