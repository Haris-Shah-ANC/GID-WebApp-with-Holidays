import React, { useContext, useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import { getLoginDetails, getWorkspaceInfo } from '../../../config/cookiesInfo';
import { apiAction } from '../../../api/api';
import { Divider, Fade, Menu, MenuItem, Tooltip } from '@mui/material';
import ModelComponent from '../../custom/Model/ModelComponent';
import { actionsMenuOptions, add_folder, add_note, delete_modal, filter_and_sort, folderMenuOptions, manage_action, notesMenuOptions, sampleFolders, share_note } from '../../../utils/Constant';
import { employee, getAddNoteUrl, getDeleteFolderUrl, getFetchNoteUrl, getFolderListUrl, getNotesUrl, getUpdateNoteUrl } from '../../../api/urls';
import CustomLabel from '../../custom/Elements/CustomLabel';
import PopupMenu from '../../custom/PopupMenu';
import GidInput from '../../custom/Elements/inputs/GidInput';
import { isFormValid, notifyErrorMessage, notifyInfoMessage } from '../../../utils/Utils';
import { LinkedText } from '../../custom/Elements/buttons/LinkedText';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import AutocompleteDropdown from '../../custom/Dropdown/AutocompleteDropdown';

function UserNotes(props) {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const { work_id } = getWorkspaceInfo();
    const editorRef = useRef(null);
    const [showModal, setShowModal] = useState(false)
    const [modal_data, setModalData] = useState({});
    const [newNoteFolderData, setAddNoteFolderData] = useState(null)
    const [filterData, setFilters] = useState({ project_id: null })
    const [postBody, setPostBody] = useState({ workspace_id: work_id })
    const [selectedFolder, selectFolder] = useState(null)
    const [hoveredElement, setHoveredElement] = useState(null)
    const [hoverChildElement, setHoverChildElement] = useState(null)
    const [folderList, setFolderList] = useState([])
    const [notesListUnderFolder, setNotesListUnderFolder] = useState([])
    const [selectedChildNote, selectChildNote] = useState(null)
    const [isNetworkCallRunning, setNetworkCallStatus] = useState(false)
    const [isMenuVisible, setMenuVisible] = useState(false)
    const [formData, setFormData] = useState({ workspace: work_id, title: "", folder: newNoteFolderData ? newNoteFolderData.id : null, note: "", folder_name: '', attachment: null })
    const [isNoteTitleEditable, setNoteTitleEditable] = useState(false)
    const [allNotesList, setAllNotesList] = useState([])
    const [searchedText, setSearchedText] = useState("")
    const [actionsMenuVisible, setActionsMenuVisible] = useState(false)
    const [employeeList, setEmployeeList] = useState([])
    const [isSharedFolderSelected, setSharedFolderSelection] = useState(false)
    const [sharedNotesList, setSharedNotesList] = useState([])
    const [mode, setMode] = useState("read")
    const [isNoteDataChanged, setNoteDataChanged] = useState(false)
    let colors = ["bg-blue-200", "bg-green-200", "bg-indigo-300", "bg-pink-200",]
    useEffect(() => {
        fetchFolderList()

    }, [postBody])

    useEffect(() => {
        fetchAllNotesList("")
        getEmployeeList()
    }, [])

    let getFolderName = isSharedFolderSelected ? { name: "Shared" } : folderList.find((item) => selectedChildNote ? selectedChildNote.folder == item.id : null)

    const fetchNotesList = async (folderId) => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getNotesUrl(), method: 'post', navigate: navigate, dispatch: dispatch, data: { workspace: work_id, folder: folderId } })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setNotesListUnderFolder(response.result)
                    
                    if(selectedChildNote){
                        let findUpdatedNote = response.result.find((item) => item.id == selectedChildNote.id)
                        console.log("FINDED",findUpdatedNote)
                        if(findUpdatedNote){
                            selectChildNote(findUpdatedNote)
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    const fetchSharedNotesList = async () => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getNotesUrl(), method: 'post', navigate: navigate, dispatch: dispatch, data: { workspace: work_id, shared: true } })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setSharedNotesList(response.result)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    const fetchAllNotesList = async (searchedTest) => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getNotesUrl(work_id, user_id, null, searchedTest), method: 'post', navigate: navigate, dispatch: dispatch, data: { workspace: work_id } })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setAllNotesList(response.result)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const isNoteEditAction = () => {
        return Boolean(formData.id)
    }

    const createNote = async () => {



        let validation_data = [
            { key: "title", message: 'title field left empty!' },
            { key: "note", message: 'note field left empty!' },
        ]

        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: isNoteEditAction() ? getUpdateNoteUrl() : getAddNoteUrl(),
                data: formData,
            })
            if (res) {
                setNoteTitleEditable(false)
                if (!isNoteEditAction()) {
                    notesListUnderFolder.push(res.result)
                    setNotesListUnderFolder(notesListUnderFolder)
                } else {
                    fetchNotesList(formData.folder)

                }
                setFormData(res.result)
                // selectChildNote(res.result)


                // notifySuccessMessage(res.status);
            } else {
                // notifyInfoMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }
    const fetchFolderList = async () => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getFolderListUrl(work_id, user_id, ""), method: 'get', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setFolderList(response.result)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const fetchSingleNote = async (noteID) => {
        let res = await apiAction({ url: getFetchNoteUrl(work_id, noteID), method: 'get', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                if (response) {
                    let responseData = response.result
                    responseData['note_id'] = response.id
                    setMode('read')
                    setFormData(responseData)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const deleteNote = async (noteID) => {
        let res = await apiAction({ url: getFetchNoteUrl(work_id, noteID), method: 'delete', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                if (selectedChildNote && selectedChildNote.id == noteID) {
                    selectChildNote(null)
                    clearPreviousNoteData()
                    setNoteTitleEditable(false)
                    setAddNoteFolderData(null)
                }
                let noteIndex = notesListUnderFolder.findIndex((item) => item.id == Number(noteID))
                notesListUnderFolder.splice(noteIndex, 1)
                setNotesListUnderFolder(notesListUnderFolder)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const deleteFolder = async (folderId) => {
        let res = await apiAction({ url: getDeleteFolderUrl(work_id, folderId), method: 'delete', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                if (selectedFolder && selectedFolder.id == folderId || newNoteFolderData && newNoteFolderData.id == folderId) {
                    selectFolder(null)
                    selectChildNote(null)
                    clearPreviousNoteData()
                    setAddNoteFolderData(null)
                }

                // let noteIndex = folderList.findIndex((item) => item.id == folderId)
                // console.log("Note Index", noteIndex)
                // folderList.splice(noteIndex, 1)

            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        // setFolderList(folderList)
        fetchFolderList()
    }
    const getEmployeeList = async () => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: employee(work_id),
        })
            .then((response) => {
                if (response.success) {
                    setEmployeeList(response.results)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    const onCreateNote = () => {
        let noteData = editorRef.current.getContent()
        formData.note = noteData
        if (isNoteEditAction()) {
            formData['note_id'] = formData.id
            delete formData['employee_id_list']
            delete formData['permission']
            delete formData['updated_at']
            delete formData['created_at']
            delete formData['created_by']
            delete formData['updated_by']

        }
        setFormData({ ...formData })
        createNote()
        // console.log(formData)
    }
    const onFolderMenuClick = (option, folder) => {
        console.log("ITEM".option, folder)
        if (option == "Edit") {
            setModalData({ folder_name: folder.name, folder: folder.id, })
            setShowModal(add_folder)
        } else if (option == "Delete") {
            setModalData({ id: folder.id, subTitle: `Are you sure to delete ' ${folder.name} ' ?`, title: "Delete Folder", type: "folder" })
            setShowModal(delete_modal)
        }
        setMenuVisible(false)
    }




    const clearPreviousNoteData = () => {
        setFormData({ employee: user_id, workspace: work_id, title: "", folder: newNoteFolderData ? newNoteFolderData.id : null, note: "", folder_name: '' })
    }
    const onFilterApply = (data) => {
        setFilters(data)
        let pBody = { ...postBody, workspace_id: work_id }
        if (data.project_id) {
            pBody["projects"] = [data.project_id]
        } else {
            pBody["projects"] = []
        }
        if (postBody !== {}) {
            setPostBody(pBody)
        }
    }
    const onFilterClear = () => {
        setFilters({
            project_id: null,
        })
        setPostBody({ ...postBody, projects: [] })
    }

    const onFilterClick = () => {
        setModalData(filterData);
        setShowModal(filter_and_sort)
    }

    const isFolderSelected = (item) => {
        return JSON.stringify(hoveredElement) == JSON.stringify(item)
    }

    const isNotesSelected = (item) => {
        return JSON.stringify(hoverChildElement) == JSON.stringify(item)
    }

    const onFolderClick = (folder, event) => {
        setSharedFolderSelection(false)
        setNotesListUnderFolder([])
        if (JSON.stringify(folder) == JSON.stringify(selectedFolder)) {
            selectFolder(null)
        } else {
            fetchNotesList(folder.id)
            selectFolder(folder)
        }

    }
    const onSharedFolderClick = (event) => {
        setSharedFolderSelection(!isSharedFolderSelected)
        if (!isSharedFolderSelected) {
            fetchSharedNotesList()
        }
        event.stopPropagation();
    }
    const onRemoveProjectClick = () => {
        onFilterClear()
    }
    const onAddFolderClick = () => {
        setModalData(null)
        setShowModal(add_folder)
    }

    const onSuccess = () => {
        console.log("ON SUCCESS")
        setModalData(null)
        fetchFolderList()
        if (isSharedFolderSelected) {
            fetchSharedNotesList()
        } else {
            fetchNotesList(selectedFolder.id)
        }
    }
    const onAddNewNoteClick = (folder, event) => {
        setNoteTitleEditable(true)
        if (folder) {
            setAddNoteFolderData(folder)
            setModalData({ folders: folderList, folder: folder.id })
            setFormData({ employee: user_id, workspace: work_id, folder: folder.id, folder_name: folder.name, title: 'Untitled', note: '' })
        }
    }
    const onClickChildNoteMenuItem = (option, item) => {
        setMenuVisible(false)
        if (option == "Share") {
            setModalData(item)
            setShowModal(share_note)

        } else if (option == "Delete") {
            onDeleteNoteClick(item)
        }

    }

    const onClickNote = (note, type) => {
        if (type == "shared") {
            setSharedFolderSelection(true)
        } else {
            setSharedFolderSelection(false)
        }
        setNoteTitleEditable(false)
        selectChildNote(note)
        fetchSingleNote(note.id)
    }
    const onDeleteNoteClick = (item) => {
        setModalData({ id: item.id, subTitle: `Are you sure to delete ' ${item.title} ' ?`, title: "Delete Note", type: "note" })
        setShowModal(delete_modal)

    }
    const onDeleteItem = (id, type) => {
        if (type == "note") {
            deleteNote(id)
        } else if (type == 'folder') {
            deleteFolder(id)
        }
    }

    const isCurrentNotePresentInFolder = (folder) => {
        if (folder && selectedChildNote) {
            return selectedChildNote.folder == folder.id
        }
    }
    const onSearchedTextChange = (val) => {
        setSearchedText(val)
    }
    const onSelectFromSearch = (item) => {
        if (item) {
            onClickNote(item)
        }

    }
    const onActionsMenuOptionSelect = (option) => {
        setActionsMenuVisible(false)
        if (option === "Manage") {
            setModalData(selectedChildNote)
            setShowModal(manage_action)
        }
    }
    const getListOfEmployeeInitials = (empList = [], idList = []) => {
        let result = []
        idList.map((item) => {
            result.push(getInitials(item.employee_name))
        })

        function getInitials(value = "") {
            let result = ""
            let valArray = value.split(" ")
            valArray.map((item) => {
                result += item.at(0)
            })
            return result
        }
        return result
    }

    const isHomeSelected = () => {
        return !(Boolean(selectedFolder))
    }



    return (
        <div className='flex flex-row bg-white rounded-lg shadow pr-1 m-2'>
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={modal_data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} from={"dashboard"} onSuccess={onSuccess} onSuccessDelete={(id, type) => onDeleteItem(id, type)} />
            <div className='w-1/5 border-r-2 flex flex-col'>
                <div className='flex flex-row justify-between m-3 items-center'>
                    <span className='font-quicksand font-semibold text-gray-600'>All Topics</span>
                    <div className='flex flex-row'>
                        <Tooltip title="Add Topic" placement="top">
                            <div>
                                <i class="fa-solid fa-circle-plus" style={{ color: '#2c67ce', cursor: 'pointer', paddingRight: 5 }} onClick={onAddFolderClick}></i>
                            </div>
                        </Tooltip>
                        {/* <Tooltip title="filter by project" placement="top">
                            <div>
                                <i class="fa-solid fa-filter fa-sm" style={{ color: '#9a9b9e', cursor: 'pointer' }} onClick={onFilterClick}></i>
                            </div>
                        </Tooltip> */}

                    </div>

                </div>
                <Divider></Divider>
                <AutocompleteDropdown value={searchedText} groupByKey={"folder_name"} labelKey={"title"} onTextChange={onSearchedTextChange} data={allNotesList} onSelect={(val) => onSelectFromSearch(val)} />
                {filterData.project_id &&
                    <>
                        <div className='p-2'>
                            <div className=' p-1 bg-gray-100 px-2 rounded-md flex-row items-center flex w-fit'>
                                <span className=' font-quicksand text-sm  text-gray-600 font-medium '>{filterData.project.project_name}</span>

                                <i class="fa-regular fa-circle-xmark fa-sm" style={{ paddingLeft: 5, color: '#4a4c4f', cursor: 'pointer' }} onClick={onRemoveProjectClick}></i>
                            </div>
                        </div>
                        <Divider />
                    </>
                }

                <div className='m-1.5 flex flex-col'>
                    <div className='flex flex-col '>
                        {/* <div className={`flex items-center p-2 mt-2 hover:bg-blue-100 rounded-lg ${selectedFolder ? '' : "bg-blue-100"}`}
                            onClick={() => {
                                selectFolder(null)
                                selectChildNote(null)
                            }}>
                            <i class="fa-regular fa-circle fa-2xs" style={{ paddingRight: 10, color: selectedFolder ? '#4a4c4f' : "blue", }}></i>
                            <span className='text-sm break-all font-quicksand font-medium'>Home</span>
                        </div> */}

                        {folderList.map((item) => (
                            <>
                                <div className={`hover:bg-blue-100 p-2 mt-2 flex rounded-lg items-center cursor-pointer flex-row justify-between flex ${JSON.stringify(hoveredElement) == JSON.stringify(item) ||
                                    JSON.stringify(newNoteFolderData) == JSON.stringify(item)
                                    ? 'bg-blue-100' : ''}`}
                                    onMouseOverCapture={() => setHoveredElement(item)}
                                    onMouseOut={() => setHoveredElement(null)}
                                    onClick={(event) => {
                                        onFolderClick(item, event)
                                    }}
                                >
                                    <div className='flex items-center'>
                                        <i class="fa-regular fa-circle fa-2xs" style={{ paddingRight: 10, color: isCurrentNotePresentInFolder(item) ? "blue" : '#4a4c4f', }}></i>
                                        <span className='text-sm break-all font-quicksand font-medium'>{item.name}</span>
                                    </div>
                                    <div className='showme flex flex-row items-center '>

                                        <i class="fa-solid fa-ellipsis" onClick={(e) => {
                                            if (isMenuVisible) {
                                                setMenuVisible(false)
                                            } else {
                                                setMenuVisible(item)
                                            }
                                            e.stopPropagation()

                                        }} style={{ color: '#4a4c4f', cursor: 'pointer', display: isFolderSelected(item) || JSON.stringify(isMenuVisible) == JSON.stringify(item) ? "flex" : 'none', padding: 3 }} ></i>

                                        <Tooltip title="Add new note" placement="top">
                                            <div className='cursor-pointer' onClick={(event) => {
                                                onAddNewNoteClick(item, event)
                                                event.stopPropagation()
                                            }

                                            }>
                                                <i class="fa-solid fa-circle-plus fa-xs" style={{ padding: 3, marginLeft: 10, color: '#4a4c4f', cursor: 'pointer', display: isFolderSelected(item) ? 'flex' : 'none' }}></i>
                                            </div>
                                        </Tooltip>
                                        {JSON.stringify(selectedFolder) == JSON.stringify(item) ? <i class={`fa-solid fa-chevron-up fa-sm`} style={{ padding: 3, marginLeft: 10, color: '#4a4c4f', cursor: 'pointer', }} onClick={(event) => onFolderClick(item, event)}></i>
                                            :
                                            <i class={`fa-solid fa-chevron-down fa-sm`} style={{ padding: 3, marginLeft: 10, color: '#4a4c4f', cursor: 'pointer', }} onClick={(event) => onFolderClick(item, event)}></i>
                                        }
                                    </div>

                                    {folderList.length == 0 && !isNetworkCallRunning ?
                                        <div className='flex justify-center mt-4'>
                                            <span className='text-gray-500'>No data found.</span>
                                        </div> : null}

                                </div>
                                {JSON.stringify(isMenuVisible) == JSON.stringify(item) &&
                                    <PopupMenu menuOptions={folderMenuOptions} item={item} isClicked={isMenuVisible} onMenuItemClick={onFolderMenuClick} onClose={() => setMenuVisible(false)} />
                                }
                                {JSON.stringify(selectedFolder) == JSON.stringify(item) &&
                                    <div className=''>
                                        <div className='pb-4 flex flex-row pl-7'>
                                            <div className='w-[1px] bg-gray-300 mr-2 my-[5px]'>

                                            </div>

                                            <div className='flex flex-col w-full'>
                                                {notesListUnderFolder.map((childItem, index) => (
                                                    <div className=''>
                                                        <div key={index} className='flex flex-col '>
                                                            <div className={`hover:bg-blue-100 p-2 mt-1 flex rounded-lg items-center cursor-pointer flex-row justify-between ${JSON.stringify(selectedChildNote) == JSON.stringify(childItem) ? 'bg-blue-100' : ''}`}
                                                                onMouseOverCapture={() => setHoverChildElement(childItem)}
                                                                onMouseOut={() => setHoverChildElement(null)}
                                                                onClick={(event) => {
                                                                    onClickNote(childItem)
                                                                    event.stopPropagation()
                                                                }}
                                                            >
                                                                <div className='flex flex-row justify-between'>
                                                                    <span className='text-sm break-all font-quicksand font-medium pl-2'>{childItem.title}</span>
                                                                </div>

                                                                <div className='showme flex flex-row items-center'>
                                                                    <i class="fa-solid fa-ellipsis" onClick={(e) => {
                                                                        if (isMenuVisible) {
                                                                            setMenuVisible(false)
                                                                        } else {
                                                                            setMenuVisible(childItem)
                                                                        }
                                                                        e.stopPropagation()

                                                                    }} style={{ color: '#4a4c4f', cursor: 'pointer', display: isNotesSelected(childItem) || JSON.stringify(isMenuVisible) == JSON.stringify(childItem) ? "flex" : 'none', padding: 3 }} ></i>

                                                                </div>


                                                            </div>


                                                        </div>
                                                        {JSON.stringify(isMenuVisible) == JSON.stringify(childItem) &&
                                                            <PopupMenu menuOptions={notesMenuOptions} item={childItem} onMenuItemClick={onClickChildNoteMenuItem} isClicked={isMenuVisible} onClose={() => setMenuVisible(false)} />
                                                        }
                                                    </div>
                                                ))
                                                }
                                            </div>
                                        </div>
                                        {notesListUnderFolder.length == 0 && !isNetworkCallRunning ?
                                            <div className='flex justify-center mt-4'>
                                                <span className='text-gray-500'>No data found.</span>
                                            </div> : null}
                                    </div>
                                }
                            </>
                        ))}
                    </div>
                    <div className='flex flex-col mt-16'>
                        <div className={`flex items-center cursor-pointer justify-between p-2 mt-2 hover:bg-blue-100 rounded-lg ${isSharedFolderSelected ? 'bg-blue-100' : ""}`}
                            onClick={(event) => {
                                onSharedFolderClick(event)
                            }}>
                            <div>
                                <i class="fa-regular fa-circle fa-2xs" style={{ paddingRight: 10, color: isSharedFolderSelected ? 'blue' : "#4a4c4f", }}></i>
                                <span className='text-sm break-all font-quicksand font-medium'>Shared with me</span>
                            </div>
                            <div>
                                {isSharedFolderSelected ? <i class={`fa-solid fa-chevron-up fa-sm`} style={{ padding: 3, marginLeft: 10, color: '#4a4c4f', cursor: 'pointer', }} onClick={(event) => onSharedFolderClick(event)}></i>
                                    :
                                    <i class={`fa-solid fa-chevron-down fa-sm`} style={{ padding: 3, marginLeft: 10, color: '#4a4c4f', cursor: 'pointer', }} onClick={(event) => onSharedFolderClick(event)}></i>
                                }
                            </div>
                        </div>
                        {isSharedFolderSelected &&
                            <div className=''>
                                <div className='pb-4 flex flex-row pl-7'>
                                    <div className='w-[1px] bg-gray-300 mr-2 my-[5px]'>

                                    </div>
                                    <div className='flex flex-col w-full'>
                                        {sharedNotesList.map((sharedNoteItem, index) => (
                                            <>
                                                <div key={index} className='flex flex-col'>
                                                    <div className={`hover:bg-blue-100 p-2 mt-1 flex rounded-lg items-center cursor-pointer flex-row justify-between flex ${JSON.stringify(selectedChildNote) == JSON.stringify(sharedNoteItem) ? 'bg-blue-100' : ''}`}
                                                        onMouseOverCapture={() => setHoverChildElement(sharedNoteItem)}
                                                        onMouseOut={() => setHoverChildElement(null)}
                                                        onClick={(event) => {
                                                            onClickNote(sharedNoteItem, 'shared')
                                                            event.stopPropagation()
                                                        }}
                                                    >
                                                        <div className='flex flex-row justify-between'>
                                                            <span className='text-sm break-all font-quicksand font-medium pl-2'>{sharedNoteItem.title}</span>
                                                        </div>

                                                        <div className='showme flex flex-row items-center'>
                                                            <i class="fa-solid fa-ellipsis" onClick={(e) => {
                                                                if (isMenuVisible) {
                                                                    setMenuVisible(false)
                                                                } else {
                                                                    setMenuVisible(sharedNoteItem)
                                                                }
                                                                e.stopPropagation()

                                                            }} style={{ color: '#4a4c4f', cursor: 'pointer', display: isNotesSelected(sharedNoteItem) || JSON.stringify(isMenuVisible) == JSON.stringify(sharedNoteItem) ? "flex" : 'none', padding: 3 }} ></i>

                                                        </div>


                                                    </div>


                                                </div>
                                                {JSON.stringify(isMenuVisible) == JSON.stringify(sharedNoteItem) &&
                                                    <PopupMenu menuOptions={notesMenuOptions} item={sharedNoteItem} onMenuItemClick={onClickChildNoteMenuItem} isClicked={isMenuVisible} onClose={() => setMenuVisible(false)} />
                                                }
                                            </>
                                        ))
                                        }
                                    </div>

                                </div>
                                {sharedNotesList.length == 0 && !isNetworkCallRunning ?
                                    <div className='flex justify-center mt-4'>
                                        <span className='text-gray-500'>No data found.</span>
                                    </div> : null}
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div className='w-4/5'>
                {selectedChildNote || newNoteFolderData ?
                    <div className='pt-3' style={{ height: 'calc(100vh - 115px)', }}>
                        <div className='flex flex-row w-full justify-between items-center gap-5'>
                            {isNoteTitleEditable ?
                                <GidInput
                                    inputType={"text"}
                                    disable={false}
                                    className={"w-full border-none text-lg "}
                                    placeholderMsg={"Enter title"}
                                    value={formData.title}
                                    onBlurEvent={() => { }}
                                    onTextChange={(e) => {
                                        setFormData({ ...formData, title: e.target.value })
                                    }}
                                    style={{}}>
                                </GidInput>
                                :
                                <div className='flex flex-row items-center'>
                                    <span className='px-3 font-bold font-quicksand text-xl '>{getFolderName && getFolderName.name}{" "}
                                        <i class="fa-solid fa-chevron-right fa-xs"></i>
                                        {" "} {selectedChildNote && selectedChildNote.title}

                                    </span>
                                    {mode === "edit" &&
                                        <Tooltip title="Edit" placement="top">
                                            <div>
                                                <i onClick={() => setNoteTitleEditable(true)} class="fa-solid fa-pencil" style={{ paddingLeft: 5, color: 'blue', cursor: 'pointer' }}></i>
                                            </div>
                                        </Tooltip>
                                    }
                                </div>}

                            <div className='pr-3 flex flex-row items-center'>
                                {/* {mode === "edit" &&
                                    <span className='text-gray-500 text-xs px-1 font-quicksand'>{isNoteDataChanged ? "Unsaved" : "Saved"}</span>

                                } */}
                                <GroupButtons mode={mode} setMode={(val) => setMode(val)} disableEdit={selectedChildNote && selectedChildNote.permission === 'read'} />

                                {selectedChildNote ?
                                    <div className='flex flex-row items-center'>
                                        {getListOfEmployeeInitials(employeeList, selectedChildNote.employee_list).map((item, index) => (
                                            <>
                                                {index <= 3 &&
                                                    <span className={`text-xs font-quicksand font-semibold rounded-full ${colors[index]} p-1.5 ml-[-10px] tracking-wide text-gray-700`}>{item}</span>
                                                }
                                            </>
                                        ))}

                                        <Tooltip title="More actions" placement="top">
                                            <div className='px-3 hover:cursor-pointer' onClick={(e) => {
                                                setActionsMenuVisible(!actionsMenuVisible)
                                                e.stopPropagation()
                                            }}>
                                                <i class="fa-solid fa-ellipsis-vertical" style={{ color: '#4a4c4f', cursor: 'pointer', }} ></i>
                                            </div>
                                        </Tooltip>
                                    </div>
                                    : null}

                                {actionsMenuVisible &&
                                    <PopupMenu className={'right-3 top-6'} menuOptions={actionsMenuOptions} item={null} onMenuItemClick={onActionsMenuOptionSelect} isClicked={actionsMenuVisible} onClose={() => setActionsMenuVisible(false)} />
                                }
                            </div>

                        </div>


                        <Divider className='pt-3' />
                        <div onClick={() => { setMenuVisible(false); setActionsMenuVisible(false) }}>
                            <Editor
                                onClick={() => { setMenuVisible(false); setActionsMenuVisible(false) }}
                                apiKey='maqnmurf1rsii0z9aug8zbh2mcwd2mb5k3725m8npujc9yjl'
                                onInit={(evt, editor) => {
                                    editorRef.current = editor
                                }}
                                initialValue={formData.note}
                                disabled={mode === "read"}
                                init={{
                                    selector: 'textarea#premiumskinsandicons-borderless',
                                    skin: 'borderless',
                                    branding: false,
                                    height: 'calc(100vh - 230px)',
                                    menubar: true,
                                    plugins:
                                        "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists imagetools textpattern",
                                    toolbar:
                                        "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media |codesample| alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
                                    content_style: 'div { margin: 10px; border: 5px solid red; padding: 3px;}',
                                }}
                            />
                            <div className="flex justify-end pr-4 mt-3">
                                <PlainButton title={isNoteEditAction() ? "Save" : "Create"} className={""} onButtonClick={onCreateNote} disable={mode == "read"}></PlainButton>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex justify-center items-center flex-col' style={{ height: 'calc(100vh - 200px)' }}>
                        <span className='text-center font-medium font-quicksand text-medium pt-4 px-4'>{"Data not found."}</span>
                        <span className='text-center font-medium font-quicksand text-medium  px-4'>{"Please select a note to view or edit."}</span>
                    </div>
                }
            </div>
        </div >
    )
}

function GroupButtons(props) {
    const { mode, setMode, disableEdit } = props

    const isEditSelected = mode === "edit"

    return (
        <div className='flex flex-row items-center mr-10 rounded-md bg-gray-300 py-0.5 '>
            <Tooltip title={disableEdit ? "You do not have permission to edit content." : ""} placement="top" style={{}}>
                <div className='flex'>
                    <span onClick={() => {
                        if (!disableEdit)
                            setMode("edit")
                    }}
                        className={`text-sm font-bold font-quicksand ml-0.5 px-3 py-0.5 mr-3 ${disableEdit ? "" : "cursor-pointer"} ${isEditSelected ? "bg-white rounded text-blue-700" : "text-gray-600"}`}>
                        {isEditSelected ? "Editing" : "Edit"}
                    </span>
                </div>
            </Tooltip>
            <span onClick={() => {
                setMode("read")
            }}
                className={`text-sm cursor-pointer font-bold font-quicksand ml-0.5 px-3 py-0.5 mr-0.5 ${!isEditSelected ? "bg-white rounded text-blue-700" : "text-gray-600"}`}>
                {!isEditSelected ? "Reading" : "Read"}
            </span>
        </div>
    )
}

export default UserNotes
