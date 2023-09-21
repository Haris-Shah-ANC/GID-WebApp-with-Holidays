import { Box, Modal, Typography } from "@mui/material"
import ButtonWithImage from "../Elements/buttons/ButtonWithImage"

export default function NewModal(props) {
    const { isVisible, setVisible } = props
    const style = {
        position: 'absolute' ,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        // <Modal
        //     open={isVisible}
        //     onClose={setVisible}
        //     aria-labelledby="modal-modal-title"
        //     aria-describedby="modal-modal-description"
        // >
        //     <Box sx={style}>
        //         <Typography id="modal-modal-title" variant="h6" component="h2">
        //             Text in a modal
        //         </Typography>
        //         <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        //             Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        //         </Typography>
        //     </Box>
        // </Modal>
         <>
             {isVisible &&
                <div class="absolute top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white top-[35%] left-[47%] z-50  outline-none focus:outline-none overflow-y-auto">
                    <div className="flex items-center justify-between p-5 border-solid border-slate-200 rounded-t text-black">
                        <h3 className="text-lg font-quicksand font-bold text-center justify-center w-full">Create New</h3>
                        <ButtonWithImage
                            onButtonClick={() => { setVisible(false) }}
                            title={""}
                            className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                            icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
                        ></ButtonWithImage>
                    </div>

                    <div class="mt-3 text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg
                                class="h-6 w-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Successful!</h3>
                        <div class="mt-2 px-7 py-3">
                            <p class="text-sm text-gray-500">
                                Account has been successfully registered!
                            </p>
                        </div>
                        <div class="items-center px-4 py-3">
                            <button
                                id="ok-btn"
                                class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>}
        </> 

    )
}
