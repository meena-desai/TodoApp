import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { Box, Button } from "@material-ui/core";
import Todolist from "./todoList";
import AddToDo from "./addToDo";
import { Dialog, Grid } from '@material-ui/core';
import moment from 'moment';
import Utils from '../helper/util'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500
    }
}));

export default function FullWidthTabs() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [currentTodo, setCurrentTodo] = React.useState({});

    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleClickOpen = () => {
        setCurrentTodo({ id: Utils.random(), title: '', deadline: moment().format('YYYY-MM-DD') })
        setOpen(true);
        setIsEdit(false)
    };

    const handleSubmit = (data) => {
        Utils.getLocal().then(e => {
            if (isEdit) {
                Utils.setLocal(e.map(f => f.id === data.id ? { ...data } : f))
            } else {
                Utils.setLocal(e ? [...e, data] : [data])
            }
        })
        setOpen(false);
    }

    const onEditCallback = (_id) => {
        Utils.getLocal().then(e => {
            const temp = { ...currentTodo, ...e.find(f => f.id === _id) }
            setCurrentTodo(temp)
            setOpen(true);
            setIsEdit(true)
        })

    }

    return (
        <>
            <div>
                <AppBar position="static" color="default">
                    <Tabs  value={value} onChange={handleChange}  indicatorColor="primary"
                        textColor="primary" variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Pending" {...a11yProps(0)} />
                        <Tab label="Completed" {...a11yProps(1)} />
                        <Tab label="Overdue" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Todolist _type={"pending"} status={open} onEditCallback={onEditCallback}></Todolist>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Todolist _type={"completed"} status={open} onEditCallback={onEditCallback}></Todolist>
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <Todolist _type={"overdue"} status={open} onEditCallback={onEditCallback}></Todolist>
                    </TabPanel>
                </SwipeableViews>
                {value === 0 &&
                    <Grid style={{ position: 'fixed', bottom: '0' }} container direction="row" justifyContent="center" alignItems="center" spacing={2}    >
                        <Grid item>
                            <Box mb={2}>
                                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                                    Add
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>}
            </div>
            {open &&
                <Dialog fullWidth={true} open={open} onClose={handleClose} >
                    <AddToDo handleSubmit={handleSubmit} isEdit={isEdit} handleClose={handleClose} currentTodo={currentTodo} />
                </Dialog>
            }
        </>
    );
}
