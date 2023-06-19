import React from "react";
import { createPopper } from "@popperjs/core";

const PopUpMenu = (props) => {
  const {popoverRef, popoverShow, onTaskEditClick, onTaskCompleteClick, taskData} = props
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full text-center">
          <div
            className={
              (popoverShow ? "" : "hidden ") +
              "bg-white border-0 mr-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg shadow-lg"
            }
            ref={popoverRef}
          >
            <div className="mx-3 my-1">
              <div className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => {onTaskEditClick()}}>Edit</div>
              {taskData.status.toLowerCase() != "on hold" && <div className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => {onTaskEditClick()}}>OnHold</div>}
              <div className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => {onTaskCompleteClick()}}>Completed</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUpMenu;