import React from 'react'
import { Dialog, DialogTitle, DialogContent,DialogContentText, DialogActions, Button } from '@material-ui/core';

export default function ConfirmDialog(props) {
    return (
        <>
            <Dialog open ={true} onClose={props.handleClose}
                aria-labelledby="dialog-title"
            >
                <DialogTitle>
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.confirmText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={props.handleSubmit} color="secondary">
                        {props.confirmButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
