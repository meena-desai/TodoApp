import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import ConfirmDialog from './confirmDialog'
import Utils from '../helper/util'

export default function Todolist({ _type, status, onEditCallback }) {
    const [list, setList] = useState([]);
    const [selectedCard, setSelectedCard] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');

    useEffect(() => {
        const temp = JSON.parse(window.localStorage.getItem("todo_List")) || [];
        setList([...temp.map(m=> (m.type == 'pending' && moment().add(-1, 'days').isAfter(m.deadline))? {...m, type:'overdue'}: m)]);
    }, [status]);

    const editClick = (event, data) => {
        event.preventDefault();
        event.stopPropagation();
        onEditCallback(data)
    }

    const handleClose = () => {
        setConfirmOpen(false)
    }

    const deleteClick = () => {
        setConfirmText('Do you want to delete selected item(s)?')
        setConfirmButtonText('Delete')
        setConfirmOpen(true)
    }

    const completeClick = () => {
        setConfirmText('Do you want to complete selected item(s)?')
        setConfirmButtonText('Complete')
        setConfirmOpen(true)
    }

    const cardClicked = (_id) => {
        if (selectedCard.includes(_id)) {
            setSelectedCard([...selectedCard.filter(f => f !== _id)])
        } else {
            setSelectedCard([...selectedCard, _id])
        }
    }

    const handleSubmit = () => {
        if (confirmButtonText === 'Delete') {
            const temp = list.filter(f => !selectedCard.includes(f.id))
            setList([...temp])
            Utils.setLocal([...temp])
        }
        if (confirmButtonText === 'Complete') {
            const tempd = list.map(m=> selectedCard.includes(m.id)? {...m, type:'completed'}: m)
            setList([...tempd])
            Utils.setLocal([...tempd])
        }
        setConfirmOpen(false)
        setSelectedCard([])
        setConfirmButtonText('')
        setConfirmText('')
    }

    return (
        <>
            <Grid container direction="row" justifyContent="space-between" alignItems="center"    >
                <Box></Box>
                <Box m={1} >
                    <Grid container direction="row" spacing={1}  >
                        <Grid item>
                            <Button variant="outlined" size="small" color="secondary" disabled={selectedCard.length === 0} onClick={() => deleteClick()}>
                                Delete
                                    </Button>
                        </Grid>
                      { _type !== 'completed' &&  <Grid item>
                            <Button variant="outlined" size="small" color="primary" disabled={selectedCard.length === 0} onClick={() => completeClick()}>
                                Complete
                                    </Button>
                        </Grid>}
                    </Grid>
                </Box>
            </Grid>
            {list?.filter((f) => f.type === _type).length === 0 && <Card variant="outlined">
                <CardContent style={{ padding: '0.5rem' }}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center"                                    >
                        <Box ><Typography variant="body" >
                            No items to display. 
                            { _type === 'pending' && `Please press “Add” to add new items.`}
                        </Typography>
                        </Box>
                    </Grid>
                </CardContent>
            </Card>
            }
            {list
                ?.filter((f) => f.type === _type)
                    .map((e) => (<>
                        <Box mb={1} p={0}>
                            <Card variant="outlined" onClick={() => cardClicked(e.id)} style={selectedCard.includes(e.id) ?
                                { border: '1px solid #3f51b5', backgroundColor: '#f5f5f5' } : {}} >
                                <CardContent style={{ padding: '0.5rem' }}>
                                    <Grid container direction="row" justifyContent="space-between" alignItems="center"                                    >
                                        <Box ><Typography variant="body" p={0}>
                                            {e.title}
                                        </Typography>
                                            <Typography color="textSecondary" style={{ marginLeft: '1rem' }} variant="body" >
                                                <small>{` ${moment(e.deadline).format('DD MMM YY')}`}</small>  </Typography>
                                        </Box>
                                        <Button variant="outlined" size="small" color="primary" onClick={(event) => editClick(event, e.id)}>
                                            Edit
                                    </Button>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </>))
            }

            {confirmOpen && <ConfirmDialog handleSubmit={handleSubmit} confirmText={confirmText} confirmButtonText={confirmButtonText} handleClose={handleClose} />}
        </>
    );
}
