import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.loadPlaylists();
    }, []);

    function handleCreateNewList() {
        store.createNewList([]);
    }
    function handleSearch(){
        console.log("Search");
    }
    function home(){
        store.goHome();
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleLogout = () => {
        handleMenuClose();
        console.log("Trying to sort");
    }
    function  handleSort(sortType){
        handleMenuClose();
        store.sort(sortType);
    }

    const menuId = 'primary-search-account-menu';
    const sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={(event)=>handleSort("creation")}>{"Creation Date (Old-New)"}</MenuItem>
            <MenuItem onClick={(event)=>handleSort("edit")}>{"Last Edit Date (New-Old)"}</MenuItem>
            <MenuItem onClick={(event)=>handleSort("name")}>{"Name (A-Z)"}</MenuItem>
            <MenuItem onClick={(event)=>handleSort("publish")}>{"Publish Date (Newest)"}</MenuItem>
            <MenuItem onClick={(event)=>handleSort("listens")}>{"Listens (High-Low)"}</MenuItem>
            <MenuItem onClick={(event)=>handleSort("likes")}>{"Likes (High-Low)"}</MenuItem>
            <MenuItem onClick={(event)=>handleSort("dislikes")}>{"Dislikes (High-Low)"}</MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let text ="";
    if (store.currentPlayingList)
        text = store.currentPlayingList.name;
    let list = "";
    if(store.playlists){
        list = store.playlists.map((playlist) => (
            <ListCard
                key = {playlist._id}
                playlist={playlist}
                selected={false}
                />
            ));
    }
    return (
        <Grid container sx={{ bgcolor: 'primary.dark' }}>
                <Grid item xs = {12} sm = {6} md = {4} lg = {3} xl = {2} sx={{pb: 1}}>
                    <Box  >
                        <Button startIcon={<HomeOutlinedIcon id = "selector-icon" onClick={home}/>}></Button >
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
                                <Button startIcon={<SortIcon id = "selector-icon"/>}
                                        edge="end"
                                        aria-label="account of current user"
                                        aria-controls={menuId}
                                        aria-haspopup="true"
                                        onClick={handleSortMenuOpen}> 
                                
                                </Button>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs ={12} md = {7} >
                        <List sx={{ width: '100%',overflow: 'auto',maxHeight:'65vh'}}>
                        {list}
                        </List>; 
                </Grid>
                <Grid item xs ={12} md = {5} >
                    <Box sx={{height:'65vh'}}>edfbhtbrtd</Box>
                </Grid>
                <Grid item xs ={12} md = {12} sx={{textAlign:'center'}}>
                    {store.isHome()?
                    <Box>
                        <Button onClick={handleCreateNewList} sx={{color:'black',fontSize:'80px', maxHeight:'7vh', bottom:'10px'}} >
                            +
                        </Button>
                        <Typography variant="dense" sx={{fontSize:'50px'}} >Your Lists</Typography>
                    </Box>: <Typography variant="h4">{text}</Typography>}
                </Grid>
                { sortMenu  }
        </Grid>
        )
}

export default HomeScreen;