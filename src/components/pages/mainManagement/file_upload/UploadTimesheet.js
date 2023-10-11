import React from 'react'
import Mapping from './mapping/Mapping'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TimesheetFileData from './TimesheetFileData';
import HorizontalLinearStepper from './mapping/HorizontalLinearStepper';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import FileUploadButton from '../../../custom/Elements/buttons/FileUploadButton';
export const UploadTimesheet = () => {



    return (
        <div className='overflow-hidden'>
           
            <HorizontalLinearStepper />
            <TimesheetFileData />
           
        </div>
        // <DndProvider backend={HTML5Backend}> <Mapping /></DndProvider>
    )
}
