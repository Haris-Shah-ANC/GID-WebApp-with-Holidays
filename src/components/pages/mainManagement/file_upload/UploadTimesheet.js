import React, { useContext, useEffect } from 'react'
import Mapping from './mapping/Mapping'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TimesheetFileData from './TimesheetFileData';
import HorizontalLinearStepper from './mapping/HorizontalLinearStepper';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import FileUploadButton from '../../../custom/Elements/buttons/FileUploadButton';
import { MAPPING } from '../../../../utils/Constant';
import * as Actions from '../../../../state/Actions';
import { DisplayMappedColumnFile } from './DisplayMappedColumnFile';

export const UploadTimesheet = () => {
    const state = Actions.getState(useContext);
    const dispatch = Actions.getDispatch(useContext);
    const { mappings, mapping_for, activeStep } = state

    return (
        <div className='overflow-hidden'>
            <HorizontalLinearStepper />
            {activeStep == 0 && <TimesheetFileData />}
            {activeStep == 1 && <DndProvider backend={HTML5Backend}> <Mapping /></DndProvider>}
            {activeStep == 2 && <DisplayMappedColumnFile />}
        </div>

    )
}
