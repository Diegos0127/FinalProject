import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SortIcon from '@mui/icons-material/Sort';
import TextField from '@mui/material/TextField';

import Typography from '@mui/material/Typography'
/*
    This React component lists all the playlister lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    function handleSearch(){
        console.log("Search");
    }

    return (
        <Grid container sx={{ bgcolor: 'primary.dark' }}>
                <Grid item xs = {12} sm = {6} md = {4} lg = {3} xl = {2} sx={{pb: 1}}>
                    <Box  >
                        <Button startIcon={<HomeOutlinedIcon id = "selector-icon"/>}></Button >
                        <Button startIcon={<GroupsOutlinedIcon id = "selector-icon" />}></Button>
                        <Button startIcon={<PersonOutlineOutlinedIcon id = "selector-icon"/>}> </Button>
                    </Box>
                </Grid> 
                <Grid item xs ={12} md = {6} >
                    <Box component="form" noValidate onSubmit={handleSearch} sx={{ mt: 1, bgcolor:'common.white' }}>
                        <TextField fullWidth label="Search" variant = 'filled' />
                    </Box>
                </Grid>
                <Grid item xs ={0} md={0} xl = {2}></Grid>
                <Grid item xs ={6} xl = {2}>
                        <Grid container justifyContent="flex-end" sx={{ bgcolor: 'primary'}}>
                            <Grid item md = {6} >
                                <Typography max height sx={{fontWeight:'bold', fontSize:'22px', height:'10px', textAlign:'center', mt:3 }}>SORT BY</Typography>
                            </Grid>
                            <Grid item md = {3} >
                                <Button startIcon={<SortIcon id = "selector-icon"/>}> </Button>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs ={12} md = {7} >
                    
                        <List sx={{ width: '100%',
        overflow: 'auto',maxHeight:'65vh'}}>
                        {
                        store.idNamePairs.map((pair) => (
                            <ListCard
                                key={pair._id}
                                idNamePair={pair}
                                selected={false}
                                />
                            ))
                        }
                        <MUIDeleteModal />
                        </List>;
                        
                    
                </Grid>
                <Grid item xs ={12} md = {5} >
                    <Box sx={{height:'65vh'}}>edfbhtbrtd</Box>
                </Grid>
                <Grid item xs ={12} md = {12} >
                    <Box>
                        <Fab
                            aria-label="add"
                            id="add-list-button"
                            onClick={handleCreateNewList}>
                            <AddIcon />
                        </Fab>
                        
                        <Typography variant="dense" sx={{fontSize:'50px'}} >Your Lists</Typography>
                    </Box>
                </Grid>
        </Grid>
        )
}

export default HomeScreen;