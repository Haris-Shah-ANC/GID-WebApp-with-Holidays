import React from 'react'
import { Stack } from '@mui/material'
import { ItemTypes } from './ItemTypes'
import { DropGetter } from './DropGetter'
import { DragGetter } from './DragGetter'

const Mapping = () => {

    function isDropped(boxName) {
        return files_headers.indexOf(boxName) > -1;
    }
    const handleDrop = (index, item) => {
        // console.log('item',index,item)
        // console.log('model_fields',model_fields)
        let is_mapped = model_fields.find((value) => value.file_header === item.name)
        if (is_mapped) {
            console.log('===already mapped', is_mapped)
            // stateChangeManager(dispatch, Actions, true, "error", `File Column "${is_mapped.file_header}" is already mapped with Database column "${is_mapped.db_field}"`);
        } else {
            model_fields[index]["file_header"] = item.name;
            // dispatch(
            //     Actions.stateChange("mappings", {
            //         ...mappings,
            //         files_headers: [
            //             ...model_fields.filter((item) => item.file_header),
            //         ].map((i) => i.file_header),
            //     })
            // );
            // dispatch(Actions.stateChange("model_fields", [...model_fields]));
        }
    };
    const onDeleteMapping = (index) => {
        files_headers.splice(
            files_headers.indexOf(model_fields[index]["file_header"]),
            1
        );
        delete model_fields[index]["file_header"];
        // dispatch(Actions.stateChange("mappings", { ...mappings, files_headers }));
        // dispatch(Actions.stateChange("model_fields", [...model_fields]));
    };
    let files_headers = [
        "Transaction Date",
        "Value Date",
        "Description",
        "Reference Number",
        "Amount",
        "Debit or Credit",
        "Balance"
    ]
    let model_fields = [
        {
            "db_field": "Transaction Date",
            "verbose_name": "Transaction Date",
            "is_required": true,
            "for_display": true,
            "is_datefield": true
        },
        {
            "db_field": "Value Date",
            "verbose_name": "Value Date",
            "is_required": false,
            "for_display": true,
            "is_datefield": true
        },
        {
            "db_field": "Description",
            "verbose_name": "Description",
            "is_required": true,
            "for_display": true,
            "is_datefield": false
        },
        {
            "db_field": "Reference Number",
            "verbose_name": "Reference Number",
            "is_required": false,
            "for_display": true,
            "is_datefield": false
        },
        {
            "db_field": "Amount",
            "verbose_name": "Amount",
            "is_required": true,
            "for_display": true,
            "is_datefield": false
        },
        {
            "db_field": "Debit or Credit",
            "verbose_name": "Debit or Credit",
            "is_required": true,
            "for_display": true,
            "is_datefield": false
        },
        {
            "db_field": "Balance",
            "verbose_name": "Balance",
            "is_required": false,
            "for_display": true,
            "is_datefield": false
        }
    ]
    return (
        <div className='flex '>
            <div>
                {files_headers.map((item, index) => {
                    return (
                        <Stack direction={"column"} key={index}>
                            <DragGetter
                                key={index}
                                name={item}
                                type={ItemTypes.Box}
                                isDropped={isDropped(item)}
                                label={<span>
                                    {item}
                                </span>}
                            />
                        </Stack>
                    )
                })}
            </div>
            <div>
                {model_fields.map((field, index) => {
                    return (
                        <Stack direction={"column"} key={index}>
                            <DropGetter
                                key={index}
                                index={index}
                                model_field={field}
                                accept={ItemTypes.Box}
                                onDeleteMapping={onDeleteMapping}
                                onDrop={(item) => handleDrop(index, item)}
                            />
                        </Stack>
                    )
                })}
            </div>


        </div>
    )
}

export default Mapping








