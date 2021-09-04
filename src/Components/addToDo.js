import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';

export default function AddToDo(props) {
    const [title, setTitle] = React.useState('');
    const [deadline, setDeadline] = React.useState(new Date());

    useEffect(() => {
        setTitle(props.currentTodo.title)
        setDeadline(props.currentTodo.deadline)
    }, []);

    const handleClose = () => {
        props.handleClose()
    };

    const handleSubmit = (data) => {
        props.handleSubmit({ id: props.currentTodo.id, type: props.currentTodo.type || 'pending', title: title, deadline: deadline })
    }

    const onTitleChange = (e) => {
        if (e.target.id === 'date') {
            setDeadline(e.target.value)
        } else {
            setTitle(e.target.value)
        }
    }

    return (
        <div>
            <DialogTitle style={{borderBottom: '1px solid lightgray'}}>
                {props.isEdit === true ? `Edit Todo` : `Add Todo`}
            </DialogTitle>
            <DialogContent>
                <TextField id="title" label="Todo Title" placeholder="Title" margin="normal"
                    fullWidth value={title} onChange={(e) => onTitleChange(e)}/>

                <TextField id="date" label="Deadline" type="date" value={deadline}
                    onChange={(e) => onTitleChange(e)}
                    InputProps={{inputProps: { min: moment().format('YYYY-MM-DD')} }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

            </DialogContent>
            <DialogActions>
                <Button disabled={title === '' || deadline === ''} onClick={handleSubmit} color="primary">
                    {props.isEdit === true ? `Edit` : `Add`}
                </Button>
                <Button onClick={handleClose} color="primary">
                    Cancel
          </Button>
            </DialogActions>

        </div >
    );
}

