import React, { useContext, useEffect, useState } from 'react'
import { Divider, Stack } from '@mui/material'
import { ItemTypes } from './ItemTypes'
import { DropGetter } from './DropGetter'
import { DragGetter } from './DragGetter'
import * as Actions from '../../../../../state/Actions';
import { twMerge } from 'tailwind-merge'
import PlainButton from '../../../../custom/Elements/buttons/PlainButton'
import { compareMappings, createMappings, notifyErrorMessage, notifySuccessMessage } from '../../../../../utils/Utils'
import { getWorkspaceInfo } from '../../../../../config/cookiesInfo'
import { apiAction, apiActionFormData } from '../../../../../api/api'
import { getCreateNewMappingUrl, getMappingFieldUrl, getMappingListUrl, getRetrieveMappingUrl, getUpdateMappingUrl, getValidateTimeSheetData } from '../../../../../api/urls'
import Dropdown from '../../../../custom/Dropdown/Dropdown'
import CustomLabel from '../../../../custom/Elements/CustomLabel'
import ModelComponent from '../../../../custom/Model/ModelComponent'
import { MAPPING, add_mapping } from '../../../../../utils/Constant'
import { useNavigate } from 'react-router-dom'

const Mapping = () => {
    const state = Actions.getState(useContext);
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate()

    const { work_id } = getWorkspaceInfo()
    const [listOfMapping, setListOfMapping] = useState([])
    const { mappings, mapping_for, mapping, model_fields } = state
    const { rows, fileName, columns, uploadedFile, file_headers, mapped_headers } = mappings
    const [isVisible, setVisible] = useState(false)
    const [isNewMapping, setNewMapping] = useState(true);

    const isRequiredFieldsMapped = () => {
        const requiredModelFields = model_fields.filter(
            (field) => field.is_required && field.for_display
        );
        return requiredModelFields.find(
            (field) => field.file_header === undefined || field.file_header === null
        )
            ? false
            : true;
    };

    useEffect(() => {
        getMappingList()
        console.log("USE EFFECT")
        // eslint-disable-next-line
    }, [])


    const onSelectMapping = (mapping) => {
        if (mapping) {
            let mapped_data = mapping.mapping;
            let mapped_keys = Object.keys(mapping.mapping);

            //eslint-disable-next-line
            model_fields.map((field) => {
                if (mapped_keys.indexOf(field.db_field) > -1 && file_headers.find((item) => item === mapped_data[field.db_field])) {
                    field["file_header"] = mapping.mapping[field.db_field];
                } else {
                    delete field["file_header"];
                }
            });
            dispatch(
                Actions.stateChange("mappings", {
                    ...mappings,
                    mapped_headers: Object.values(mapping.mapping),
                })
            );
            dispatch(Actions.stateChange("model_fields", [...model_fields]));
        }
    }

    function isDropped(boxName) {
        return mapped_headers.indexOf(boxName) > -1;
    }

    const getMappingList = async () => {
        let res = await apiActionFormData({ url: getMappingListUrl(), method: "post", data: { workspace_id: work_id } })
            .then((response) => {
                setListOfMapping([{ name: 'Select Mapping' }, ...response.result])

            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    const retrieveMapping = async (id) => {
        let res = await apiActionFormData({ url: getRetrieveMappingUrl(), method: "post", data: { workspace_id: work_id, mapping_id: id } })
            .then((response) => {

            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    const onSubmitMapping = async (name, description) => {
        let body = getMappingBody(name, description)
        let res = mapping && mapping.id
            ? await apiAction({
                method: "post",
                navigate: navigate,
                dispatch: dispatch,
                url: getUpdateMappingUrl(mapping.id),
                data: { ...body },
            })
                .then((response) => {
                    if (response.success) {
                        onAddMappingSuccess(response.result)
                        notifySuccessMessage(response.status);
                    } else {
                        notifyErrorMessage(response.status)
                    }
                })
                .catch((error) => {

                })
            : await apiAction({
                method: "post",
                navigate: navigate,
                dispatch: dispatch,
                url: getCreateNewMappingUrl(),
                data: { ...body },
            })
                .then((response) => {
                    if (response.success) {
                        onAddMappingSuccess(response.result)
                        notifySuccessMessage(response.status);
                    } else {
                        notifyErrorMessage(response.status)
                    }
                })
                .catch((error) => {
                    console.log("ERROR", error)
                })
    }

    const updateMapping = (newlyAddedMapping) => {
        console.log("UPDATE MAPPING")
        dispatch(Actions.stateChange("mapping", newlyAddedMapping));
        onSelectMapping(newlyAddedMapping)
    }
    const handleDrop = (index, item) => {
        let is_mapped = model_fields.find((value) => value.file_header === item.name)
        if (is_mapped) {
            console.log('===already mapped', is_mapped)
        } else {
            model_fields[index]["file_header"] = item.name;
            dispatch(
                Actions.stateChange("mappings", {
                    ...mappings,
                    mapped_headers: [
                        ...model_fields.filter((item) => item.file_header),
                    ].map((i) => i.file_header),
                })
            );
            dispatch(Actions.stateChange("model_fields", [...model_fields]));
        }
    };

    const onDeleteMapping = (index) => {
        mapped_headers.splice(
            mapped_headers.indexOf(model_fields[index]["file_header"]),
            1
        );
        delete model_fields[index]["file_header"];
        dispatch(Actions.stateChange("mappings", { ...mappings, mapped_headers }));
        dispatch(Actions.stateChange("model_fields", [...model_fields]));
    };

    const getMappingBody = (name, description) => {
        let mappings_body = {};
        let create_new_mapping = createMappings(model_fields);
        mappings_body["name"] = name;
        mappings_body["description"] = description;
        mappings_body["workspace_id"] = work_id;
        mappings_body["mapping"] = create_new_mapping;

        if (mapping && mapping.id) {
            mappings_body["mapping_id"] = mapping.id
        }
        return mappings_body;
    };

    const onAddMappingSuccess = (data) => {
        dispatch(Actions.stateChange("mapping", data));
        onSelectMapping(data)

    }
    const isMappingChanged = () => {
        let create_new_mapping = createMappings(model_fields)
        const isMappingDifferentObj = !compareMappings(mapping && mapping.mapping, create_new_mapping);
        const isMappingDifferentStr = mapping && JSON.stringify(mapping.mapping, 0, 2) !== JSON.stringify(create_new_mapping, 0, 2);
        return isMappingDifferentObj;
    };
    const mapped_items = model_fields.filter((field) => field.file_header);
    const selectedMapping = mapping && listOfMapping.find((item) => item.id === mapping.id)
    const columnContainer = twMerge(`p-4`,)
    const mainContainer = twMerge(`border-x-[1px] border-b-[1px] border-gray-300 shadow rounded`,)
    return (
        <div className='mx-4'>
            <ModelComponent showModal={isVisible} setShowModal={setVisible} data={mapping} onSuccess={onSubmitMapping} />
            <div className='flex flex-row gap-6 py-6 justify-between'>
                <div className='w-[300px]'>
                    <Dropdown placeholder={true} options={listOfMapping} optionLabel={'name'} value={mapping ? selectedMapping : { name: 'Select Mapping' }} setValue={(value) => {
                        if (value.id) {
                            dispatch(Actions.stateChange("mapping", value));
                            onSelectMapping(value)
                        } else {
                            dispatch(Actions.stateChange("mapping", null));
                            model_fields.map((item) => {
                                delete item.file_header;
                            });
                            dispatch(Actions.stateChange("mappings", { ...mappings, mapped_headers: [], }));
                            dispatch(Actions.stateChange("model_fields", [...model_fields]));
                        }

                    }} />
                </div>
                <div className='gap-6 flex'>
                    {mapping && mapping.id ?
                        <PlainButton onButtonClick={() => {
                            setNewMapping(false)
                            setVisible(add_mapping)
                        }} title={"Update Mapping"} className={`py-2 bg-white text-blue-600 hover:bg-blue-100 border-blue-600 border-0 border-[1px] ${mapped_headers.length === 0 || !isMappingChanged() || !isRequiredFieldsMapped() ? " border-gray-300 text-gray-400 hover:bg-gray-50" : ""}`}
                            disable={mapped_headers.length === 0 ||
                                !isMappingChanged() ||
                                !isRequiredFieldsMapped()} />
                        :

                        <PlainButton onButtonClick={() => {
                            setVisible(add_mapping)
                        }} title={"Save Mapping"} className={`py-2 bg-white text-blue-600 hover:bg-blue-100 border-blue-600 border-0 border-[1px] ${mapped_headers.length === 0 || !isRequiredFieldsMapped() ? " border-gray-300 text-gray-400 hover:bg-gray-50" : ""}`}
                            disable={mapped_headers.length === 0 || !isRequiredFieldsMapped()} />}



                    <PlainButton onButtonClick={() => {
                        dispatch(Actions.stateChange("activeStep", 2))
                    }}
                        title={"Next"} className={"py-2"} disable={mapped_headers.length === 0 || mapping === null || isMappingChanged()} />
                </div>
            </div>

            <div class="grid grid-cols-3 gap-5 mt-4">
                <div className={mainContainer}>
                    <div className='py-3'>
                        <ColumnHeader text={"Columns in uploaded file"} className={'font-bold text-lg'} />
                        <ColumnHeader text={"Columns available in file"} className={'text-gray-500 text-sm'} />
                    </div>
                    <Divider></Divider>
                    <div className={columnContainer}>
                        {file_headers.map((item, index) => {
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
                </div>
                <div className={mainContainer}>
                    <div className='py-3'>
                        <ColumnHeader text={"Columns in Database"} className={'font-bold text-lg'} />
                        <ColumnHeader text={"Columns available in database"} className={'text-gray-500 text-sm'} />
                    </div>
                    <Divider></Divider>
                    <div className={columnContainer}>
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
                <div className={mainContainer}>
                    <div className='py-3'>
                        <ColumnHeader text={"Mapping of Columns File - Database"} className={'font-bold text-lg'} />
                        <ColumnHeader text={"Corresponding columns from file and database"} className={'text-gray-500 text-sm'} />
                    </div>
                    <Divider></Divider>
                    <div className={columnContainer}>
                        {mapped_items.map((item, index) => {
                            return (
                                <Stack direction={"column"} key={index}>
                                    <div className={`capitalize rounded-full py-1 my-3 float-left bg-[#fae6f3] text-center `}>
                                        {item.file_header} - {item.verbose_name}
                                    </div>
                                </Stack>
                            );
                        })}
                    </div>
                </div>
            </div>




        </div>
    )
}
const ColumnHeader = ({ text, className }) => {
    const tailwindMergedCSS = twMerge(`font-quicksand text-center `, className)

    return (
        <p className={tailwindMergedCSS}>{text}</p>
    )
}

export default Mapping








