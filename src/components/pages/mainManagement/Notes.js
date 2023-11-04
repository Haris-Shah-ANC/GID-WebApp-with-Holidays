import React, { useContext, useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import { getLoginDetails, getWorkspaceInfo } from '../../../config/cookiesInfo';
import { apiAction } from '../../../api/api';
import { Divider, Fade, Menu, MenuItem, Tooltip } from '@mui/material';
import ModelComponent from '../../custom/Model/ModelComponent';
import { add_folder, add_note, delete_modal, filter_and_sort, folderMenuOptions, notesMenuOptions, sampleFolders, share_note } from '../../../utils/Constant';
import { getAddNoteUrl, getDeleteFolderUrl, getFetchNoteUrl, getFolderListUrl, getNotesUrl, getUpdateNoteUrl } from '../../../api/urls';
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
    const location = useLocation();
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
    let options = ["Edit", "Delete"];
    const [folderList, setFolderList] = useState([])
    const [notesListUnderFolder, setNotesListUnderFolder] = useState([])
    const [selectedChildNote, selectChildNote] = useState(null)
    const [isNetworkCallRunning, setNetworkCallStatus] = useState(false)
    const [isMenuVisible, setMenuVisible] = useState(false)
    const [formData, setFormData] = useState({ employee: user_id, workspace: work_id, title: "", folder: newNoteFolderData ? newNoteFolderData.id : null, note: "", folder_name: '' })
    const [isNoteTitleEditable, setNoteTitleEditable] = useState(false)
    const [allNotesList, setAllNotesList] = useState([])
    const [searchedText, setSearchedText] = useState("")

    useEffect(() => {
        fetchFolderList()

    }, [postBody])
    useEffect(() => {
        fetchAllNotesList("")
    }, [])

    let getFolderName = folderList.find((item) => selectedChildNote ? selectedChildNote.folder == item.id : null)

    const fetchNotesList = async (folderId) => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getNotesUrl(work_id, user_id, folderId, ""), method: 'get', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setNotesListUnderFolder(response.results)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const fetchAllNotesList = async (searchedTest) => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getNotesUrl(work_id, user_id, null, searchedTest), method: 'get', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setAllNotesList(response.results)
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
                method: isNoteEditAction() ? "put" : 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: isNoteEditAction() ? getUpdateNoteUrl(formData.id) : getAddNoteUrl(),
                data: formData,
            })
            if (res) {
                setNoteTitleEditable(false)
                if (!isNoteEditAction()) {
                    notesListUnderFolder.push(res)
                    setNotesListUnderFolder(notesListUnderFolder)
                } else {
                    fetchNotesList(formData.folder)

                }
                setFormData(res)
                selectChildNote(res)


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
                    setFolderList(response.results)
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
                    setFormData(response)
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


    const onCreateNote = () => {
        let noteData = editorRef.current.getContent()
        formData.note = noteData
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
        setNotesListUnderFolder([])
        if (JSON.stringify(folder) == JSON.stringify(selectedFolder)) {
            selectFolder(null)
        } else {
            fetchNotesList(folder.id)
            selectFolder(folder)
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
        fetchFolderList()
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
            setShowModal(share_note)

        } else if (option == "Delete") {
            onDeleteNoteClick(item)
        }

    }

    const onClickNote = (note) => {
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


    return (
        <div className='flex flex-row bg-white rounded-lg shadow pr-1 m-2'>
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={modal_data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} from={"dashboard"} onSuccess={onSuccess} onSuccessDelete={(id, type) => onDeleteItem(id, type)} />
            <div className='w-1/5 border-r-2'>
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

                <div className='m-1.5'>
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
                                <div className='pb-4 '>
                                    {notesListUnderFolder.map((childItem, index) => (
                                        <>
                                            <div key={index} className='flex flex-col'>
                                                <div className={`hover:bg-blue-100 p-2 mt-1 flex rounded-lg items-center cursor-pointer flex-row justify-between flex ${JSON.stringify(selectedChildNote) == JSON.stringify(childItem) ? 'bg-blue-100' : ''}`}
                                                    onMouseOverCapture={() => setHoverChildElement(childItem)}
                                                    onMouseOut={() => setHoverChildElement(null)}
                                                    onClick={(event) => {
                                                        onClickNote(childItem)

                                                        event.stopPropagation()
                                                    }}
                                                >

                                                    <div className='flex flex-row justify-between'>

                                                        <span className='text-sm break-all font-quicksand font-medium pl-4'>{childItem.title}</span>


                                                    </div>
                                                    {/* <Tooltip title="Delete note" placement="top"> */}
                                                    <div className='showme flex flex-row items-center'>
                                                        <i class="fa-solid fa-ellipsis" onClick={(e) => {
                                                            if (isMenuVisible) {
                                                                setMenuVisible(false)
                                                            } else {
                                                                setMenuVisible(childItem)
                                                            }
                                                            e.stopPropagation()

                                                        }} style={{ color: '#4a4c4f', cursor: 'pointer', display: isNotesSelected(childItem) || JSON.stringify(isMenuVisible) == JSON.stringify(childItem) ? "flex" : 'none', padding: 3 }} ></i>
                                                        {/* <i class="fa-solid fa-trash fa-xs" onClick={(event) => {
                                                                onDeleteNoteClick(childItem)
                                                                event.stopPropagation()
                                                            }} style={{ color: '#a60512', display: JSON.stringify(hoverChildElement) == JSON.stringify(childItem) ? "flex" : 'none' }}></i> */}
                                                    </div>
                                                    {/* </Tooltip> */}

                                                </div>


                                            </div>
                                            {JSON.stringify(isMenuVisible) == JSON.stringify(childItem) &&
                                                <PopupMenu menuOptions={notesMenuOptions} item={childItem} onMenuItemClick={onClickChildNoteMenuItem} isClicked={isMenuVisible} onClose={() => setMenuVisible(false)} />
                                            }
                                        </>
                                    ))
                                    }
                                    {notesListUnderFolder.length == 0 && !isNetworkCallRunning ?
                                        <div className='flex justify-center mt-4'>
                                            <span className='text-gray-500'>No data found.</span>
                                        </div> : null}
                                </div>
                            }
                        </>
                    ))}
                </div>

            </div>
            <div className='w-4/5'>
                {selectedChildNote || newNoteFolderData ?
                    <div className='pt-3' style={{ height: 'calc(100vh - 115px)', }}>
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
                                <span className='px-3 font-semibold font-quicksand text-gray-600'>{getFolderName && getFolderName.name}{" "}
                                    <i class="fa-solid fa-chevron-right fa-xs"></i>
                                    {" "} {selectedChildNote && selectedChildNote.title}

                                </span>
                                <Tooltip title="Edit" placement="top">
                                    <div>
                                        <i onClick={() => setNoteTitleEditable(true)} class="fa-solid fa-pencil" style={{ paddingLeft: 5, color: 'blue', cursor: 'pointer' }}></i>
                                    </div>
                                </Tooltip>
                            </div>}


                        <Divider className='pt-3' />
                        <div className=''>
                            <Editor
                                onClick={() => setMenuVisible(false)}
                                apiKey='maqnmurf1rsii0z9aug8zbh2mcwd2mb5k3725m8npujc9yjl'
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={formData.note}
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
                                <PlainButton title={isNoteEditAction() ? "Save" : "Create"} className={""} onButtonClick={onCreateNote} disable={false}></PlainButton>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex justify-center items-center' style={{ height: 'calc(100vh - 200px)' }}>
                        <span className='text-center'>No topics selected.</span>
                    </div>
                }
            </div>
        </div >
    )
}

export default UserNotes
