import { Box, Modal } from '@mui/material';

const CommentEditModal = (props) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 15,
        borderRadius: 1,
        overflow: 'auto'
    };

    return (
        showModal ? (
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {
                        showModal === add_holidays &&
                        <AddHoliday setShowModal={setShowModal} onSuccess={onSuccess} holidayToEdit={holidayToEdit} />
                    }
                </Box>
            </Modal>
        ) : null
    );
}

export default ModalForComments ;