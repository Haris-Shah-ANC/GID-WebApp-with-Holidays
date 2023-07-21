import React, { useContext } from 'react'
import * as Actions from '../../../state/Actions'

export default function Loader() {
    let circleCommonClasses = 'h-2.5 w-2.5 bg-blue-600 rounded-full';
    const state = Actions.getState(useContext)

    return (
    <>
        {state.loader && <div className='flex absolute top-0 bottom-0 h-full w-full bg-black bg-opacity-25'>
            <div className='flex justify-center items-center w-full h-full'>
                <div className='flex items-center justify-center rounded-lg bg-blue-200 px-5 py-1'>
                    <div className=''>
                        Loading
                    </div>
                    <div className='flex ml-2'>
                        
                        <div className={`${circleCommonClasses} mr-1 animate-bounce400`}></div>
                        <div className={`${circleCommonClasses} animate-bounce400`}></div>
                        <div className={`${circleCommonClasses} ml-1 animate-bounce`}></div>
                    </div>
                </div>
            </div>
        </div>
        }
    </>
    );
}
