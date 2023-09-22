import { Box, Modal, Typography } from "@mui/material"
import ButtonWithImage from "../Elements/buttons/ButtonWithImage"
import PlainButton from "../Elements/buttons/PlainButton"
import React from "react"
import GidInput from "../Elements/inputs/GidInput"

export default function NewModal(props) {
    const { isVisible, setVisible } = props

    return (
        <React.Fragment>
            {isVisible &&
                <div className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative my-6 max-w-sm w-full">
                            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                                {/* header */}
                                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Upload File'}</h3>
                                    <button
                                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                                        onClick={() => ""}
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>

                                <div className='px-3 py-5 w-full flex flex-col'>
                                    <div className='flex-row flex items-center'>
                                        <input
                                            accept=".xls,"
                                            id="input-file"
                                            type="file"
                                            className='border w-full p-1 rounded-md cursor-pointer'
                                            onChange={(e) => ""}
                                            onClick={(e) => {
                                                e.target.value = null
                                            }}
                                        />
                                        <h3 className='ml-28 mr-10 text-black font-quicksand font-semibold absolute truncate w-full'>{""}</h3>


                                    </div>

                                    <label className='mt-3 text-gray-600 font-quicksand font-semibold'>Year</label>
                                    <GidInput
                                        inputType={"number"}
                                        id={"year"}
                                        disable={false}
                                        className={""}
                                        value={""}
                                        onBlurEvent={() => { }}
                                        placeholderMsg="e.g 2023"
                                        onTextChange={(event) => {
                                            
                                        }}
                                    >
                                    </GidInput>

                                    <PlainButton title={"Upload"} className={"mt-10"} onButtonClick={""} disable={false}></PlainButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}
