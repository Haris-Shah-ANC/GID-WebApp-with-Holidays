import React, { useContext, useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import { getLoginDetails, getWorkspaceInfo } from '../../../config/cookiesInfo';
import { apiAction } from '../../../api/api';
import { getNotesUrl, getSaveNoteUrl } from '../../../api/urls';

function UserNotes(props) {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const location = useLocation();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const { work_id } = getWorkspaceInfo();
    const [notesData, setNotesData] = useState("")
    const editorRef = useRef(null);

    // useEffect(() => {
    //     console.log("PATHNAME", editorRef.current.getContent())
    // }, [editorRef])

    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }

    };
    const fetchNotes = async () => {
        let res = await apiAction({ url: getNotesUrl(), method: 'get', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                if (response.success) {
                    setNotesData(response.result)
                }
            })
            .catch((error) => {

            })

    }
    const saveNotes = async () => {
        let res = await apiAction({ url: getSaveNoteUrl(), method: 'post', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                if (response.success) {
                    setNotesData(response.result)
                }
            })
            .catch((error) => {

            })

    }



    return (
        <div className='flex flex-row bg-white rounded-lg shadow pr-2 m-2'>
            <div className='w-1/4 border-r-2'>

            </div>
            <div className='w-9/12'>
                <Editor
                    apiKey='maqnmurf1rsii0z9aug8zbh2mcwd2mb5k3725m8npujc9yjl'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                        selector: 'textarea#premiumskinsandicons-borderless',
                        skin: 'borderless',
                        branding: false,
                        height: 600,
                        menubar: true,
                        plugins:
                            "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists imagetools textpattern",
                        toolbar:
                            "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media |codesample| alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
                        content_style: 'div { margin: 10px; border: 5px solid red; padding: 3px; }' ,
                        
                        
                    }}
                    


                />
            </div>
        </div>
    )
}

export default UserNotes
