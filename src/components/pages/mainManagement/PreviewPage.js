import React from 'react'

const PreviewPage = () => {
    const fileUrl = 'https://radically-vital-ape.ngrok-free.app//media/task%20attachments/ANC/60_Days_DSA_Challenge_dmc220I.pdf'; 

    const handleClose = () => {
        // Close the current window or tab
        window.close();
    };
    console.log('======>page')

    return (
        <div id='preview-page'>
            <h1>Your File</h1>
            <a href={fileUrl} download>
                <button>Download File</button>
            </a>
            <button onClick={handleClose}>Close</button>
        </div>
    );
}

// const handleDownloadFiles = async (index, fileName) => {
//     const file = formData.attachment[index];

//     // Check if the file is an image
//     const isImage = ['png', 'jpg', 'gif', 'svg'].includes(file.type);

//     // If it's an image, show the preview; otherwise, download the file
//     if (isImage) {
//         const fileUrl = file.preview;
//         const response = await fetch(fileUrl);
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob);
//         window.open(url, '_blank');
//     } else {
//         // If it's not an image, download the file
//         const fileUrl = file.preview; // Assuming the preview URL is the actual file URL
//         const response = await fetch(fileUrl);
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = fileName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }
// };

export default PreviewPage

// export const PreviewSection = ({data}) => {
//     // const openFileInNewTab = () => {
//     //     const newTab = window.open('', '_blank');

//     //     if (newTab) {
//     //         newTab.document.open();
//     //         newTab.document.write(`
//     //         <html>
//     //           <head>
//     //             <title>Your File</title>
//     //           </head>
//     //           <body>
//     //             <div id="preview"></div>
//     //             <script>
//     //               window.onload = function() {
//     //                 document.getElementById('root').innerHTML = '<h1>Loading...</h1>';
//     //               }
//     //             </script>
//     //           </body>
//     //         </html>
//     //       `);
//     //         newTab.document.close();

//     //         const FilePageComponent = (
//     //             <React.StrictMode>
//     //                 <PreviewPage />
//     //             </React.StrictMode>
//     //         );

//     //         // Render the FilePage component after a short delay to ensure the HTML is fully loaded
//     //         setTimeout(() => {
//     //             ReactDOM.render(FilePageComponent, newTab.document.getElementById('preview'));
//     //         }, 100);
//     //     }
//     // };
    
//     const initial_data = {
//         task: data ? data.task : null,
//         task_id: data ? data.task_id : null,
//         module_id: data ? data.module_id : null,
//         dead_line: data ? data.dead_line : null,
//         project_id: data ? data.project_id : null,
//         on_hold_reason: data ? data.on_hold_reason : null,
//         status: data ? data.status : 'In-Progress',
//         detailed_description: data ? data.detailed_description : null,
//         description_link: data ? data.description_link : null,
//         assign_to_id: data ? data.assignee_id : null,
//         employee: data ? data.employee : null,
//         attachment: data ? data.attachment : [],
//     }
//     const [formData, setFormData] = React.useState({ ...initial_data })
//     const [isEditAction, setEditAction] = React.useState(!formData.task_id)

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop: (acceptedFiles) => {
//             // checking for duplicate file names
//             const isDuplicate = acceptedFiles.some(file => formData?.attachment?.some(existingFile => existingFile.name === file.name));
//             if (isDuplicate) {
//                 alert("Duplicate files are not allowed.");
//                 return;
//             }

//             // checking for maximum file limit (4 files)
//             if (formData?.attachment?.length + acceptedFiles.length > 4) {
//                 alert("You can only upload up to 4 files.");
//                 return;
//             }

//             const filesWithPreview = acceptedFiles.map(file => Object.assign(file, {
//                 preview: URL.createObjectURL(file),
//                 date: 'date',
//             }));
//             setFormData((previous) => ({ ...previous, attachment: [...previous.attachment, ...filesWithPreview] }))

//             // setUploadedFiles([...uploadedFiles, ...filesWithPreview]);
//             // console.log("acceptedFiles====>",[{...acceptedFiles[0],date:'date'}])
//         },
//         multiple: true,
//     });

//     //
//     // console.log('====>uploadedFiles', uploadedFiles)

//     const handleDeleteFiles = (index) => {
//         // console.log(`File at index ${index} has been clicked for delete`)
//         const newUploadedFiles = formData?.attachment;
//         newUploadedFiles.splice(index, 1);
//         console.log("newUploadedFiles after deletion ===>", newUploadedFiles)
//         setFormData({ ...formData, attachment: newUploadedFiles });
//         console.log("formData===>", formData)
//     }

//     const handleDownloadFiles = async (index, fileName) => {
//         // console.log("formData inside download files handler===>",formData)
//         // console.log("formData inside download files handler===>",formData.attachment[index].preview)
//         let fileUrl = formData.attachment[index].preview
//         const response = await fetch(fileUrl);
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = fileName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const getPreviewUrl = (type, preview) => {
//         let files = ['png', 'jpg', 'gif', 'svg']
//         // console.log('fileType==>', files.includes(type))
//         if (files.includes(type)) {
//             // console.log("preview==>", preview)
//             return preview
//         } else {
//             let previewUrl = fileTypePreviews.find(i => i.type === type)?.url;
//             // if preview image is not available show the default image stored at the last index of the array
//             if (previewUrl === undefined) {
//                 // console.log("fileTypePreviews.undefined==>", fileTypePreviews[fileTypePreviews.length - 1].url);
//                 return fileTypePreviews[fileTypePreviews.length - 1].url;
//             }
//             // else show the preview image
//             return previewUrl;
//         }
//     }

//     const openFileInNewTab = (fileUrl) => {
//         // Specify your custom window features
//         const windowFeatures = 'width=800,height=600,scrollbars=yes';
    
//         // Open a new window
//         const newWindow = window.open('', 'CustomViewer', windowFeatures);
    
//         // Write custom content to the new window
//         newWindow.document.write(`
//           <!DOCTYPE html>
//           <html lang="en">
//           <head>
//               <meta charset="UTF-8">
//               <meta name="viewport" content="width=device-width, initial-scale=1.0">
//               <title>Custom Viewer</title>
    
//               <style>
//                   /* Your additional custom styling for the new window goes here */
//                   body {
//                       font-family: Arial, sans-serif;
//                   }
    
//                   #customViewer {
//                       width: 100%;
//                       height: 100%;
//                       padding: 20px;
//                   }
//               </style>
//           </head>
//           <body>
//               <div id="customViewer">
//                   {/* Your custom content goes here */}
//                   <h1>Custom Viewer</h1>
//                   <p>This is a customized file viewer for ${fileUrl}.</p>
//               </div>
//           </body>
//           </html>
//         `);
    
//         // You can perform additional customization and loading of file content as needed
//       };

//     return (
//         <>
//             {formData?.attachment?.length > 0 && (
//                 <div className="grid grid-cols-3 gap-4 ">
//                     {formData?.attachment?.map((file, index) => {
//                         //splitting file extension and fileName and storing them separately

//                         // console.log('====>file',file)
//                         const extension = file?.name?.split(".")[file?.name?.split(".").length - 1]
//                         const fileName = file?.name?.replace(`.${extension}`, '')
//                         // console.log("fileName++>", fileName)
//                         // console.log("extension++>", extension)
//                         // console.log("getPreviewUrl++>", fileName, getPreviewUrl(extension, file?.preview))
//                         return (
//                             <div key={file.name} className="border border-gray-300 rounded-md p-2 flex flex-col justify-between h-44 ">
//                                 <div className='container h-40'>
//                                     <img
//                                         alt={file.name}
//                                         src={getPreviewUrl(extension, file?.preview)}
//                                         className='image'
//                                         style={{ maxHeight: "120px", minHeight: "120px" }}
//                                     />

//                                     {isEditAction &&
//                                         <div class="middle flex ">
//                                             <div class="p-1 pl-2 pr-2 mr-1 cursor-pointer bg-white rounded-sm text-gray-600">
//                                                 <i class="fa-solid fa-cloud-arrow-down"
//                                                     onClick={(e) => { handleDownloadFiles(index, fileName); e.stopPropagation() }}
//                                                 >
//                                                 </i>
//                                             </div>
//                                             <div class="p-1 pl-2 pr-2 cursor-pointer bg-white rounded-sm text-gray-600">
//                                                 <i class="fa-solid fa-trash"
//                                                     onClick={(e) => { handleDeleteFiles(index); e.stopPropagation(); }}
//                                                 >
//                                                 </i>
//                                             </div>
//                                         </div>
//                                     }

//                                 </div>
//                                 <div className="border-t bg-white font-quicksand text-xs text-black p-2 flex hover:underline hover:text-blue-600 hover:cursor-pointer"
//                                     title={`${file.name}`}
//                                 >
//                                     <span onClick={() => openFileInNewTab(file?.name)}>{fileName}</span>
//                                     {/* <a href={file?.preview} target='_blank' rel="noreferrer" className='flex w-36 whitespace-nowrap font-semibold'>
//                                         <p className='overflow-ellipsis overflow-hidden'>{fileName}</p>
//                                         <p className='ml-1 '>.{extension}</p>
//                                     </a> */}
//                                     {/* {console.log("CurrentData===>", moment.format())} */}
//                                 </div>
//                             </div>
//                         )
//                     })}
//                 </div>
//             )}
//         </>
//     )
// }

// ... (previous code)



