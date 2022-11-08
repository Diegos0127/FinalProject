import { useContext } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIUserRegistrationModal() {
    const { auth } = useContext(AuthContext);

    function handleClose () {
        auth.hideModals();
    }
    
    let message = "";
    if (auth.error) {
        message = auth.error;
    }

    return (
        <Modal
            open={auth.isUserRegistrationModalOpen()||auth.isUserLoginModalOpen()}
        >
            <Box sx={style}>
            <div
        id="registration-login-modal"
        className="modal-dialog"
        data-animation="slideInOutLeft">
        <div className="modal-root" id='verify-remove-song-root'>
            <div className="modal-north">
                An error has occurred:
            </div>
            <div className="modal-center">
                <div className="modal-center-content">
                    {message} 
                </div>
            </div>
            <div className="modal-south">
                <input 
                    type="button" 
                    id="registration-login-close-button" 
                    className="modal-button" 
                    onClick={handleClose} 
                    value='Close' />
            </div>
        </div>
    </div>
            </Box>
        </Modal>
    );
}