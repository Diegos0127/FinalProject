import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import WorkspaceSubscreen from './WorkspaceSubscreen';
import EditToolbar from './EditToolbar';

/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author Diego Sandoval
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [openContentActive, setOpenContentActive] = useState(false);
    const [text, setText] = useState("");
    const { playlist, selected } = props;

    function handleClick (event, id) {
        if (event.detail === 1 ) {
            console.log("clicked list card");
            store.setCurrentPlayingList(id);
        }
        else if (event.detail === 2 && !store.currentList) {
            handleToggleEdit(event);
        }
    }
    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        if (!editActive)
            store.setIsListNameEditActive();
        setEditActive(!editActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    function toggleOpenContent(event){
        event.stopPropagation();
        store.closeCurrentList();
        if(!openContentActive)
            store.setCurrentList(playlist._id);
        setOpenContentActive(!openContentActive);
    }
    if(store.currentList&&store.currentList._id!==playlist._id){
        if(openContentActive){
            setOpenContentActive(false);
        }
    }
    let isPublished = false;
    if(playlist.publishedDate !=="1970-0-1,0:0:0")
        isPublished = true;
    let likeButton = "";
    let dislikeButton = "";

    if(isPublished){
        likeButton = <Grid item xs ={12} xl = {3}>
        <Button startIcon={<ThumbUpOffAltOutlinedIcon id = "list-card-button"/>}></Button >
        {playlist.likes.length}
    </Grid>;
       dislikeButton = <Grid item xs ={12} xl = {2} >
       <Button startIcon={<ThumbDownOffAltOutlinedIcon id = "list-card-button"/>}></Button >
       {playlist.dislikes.length}
   </Grid>;
    }

    let bgcolor = 'primary.light';
    if(isPublished)
        bgcolor = 'info.light'
    if(store.currentPlayingList&&store.currentPlayingList._id===playlist._id)
        bgcolor = '#D3B04A';

    let cardElement =
        <Box
            id={playlist._id}
            key={playlist._id}
            className={"list-card unselected-list-card"}
            sx={{ marginTop: '0.1%', display: 'flex', p: 1,fontWeight:'bold', backgroundColor: bgcolor}}
            onClick={(event) => { handleClick(event, playlist._id)}}
        >
            <Grid container >
                <Grid item xs ={12} xl = {7} sx={{ p: 1}}>
                    <Box >{playlist.name}</Box>
                    <Typography sx={{fontWeight:'bold'}}>By: {auth.user.userName}</Typography>
                </Grid>
                {likeButton} {dislikeButton}
                {openContentActive? <Grid item xs ={12} xl = {12}>
                    <WorkspaceSubscreen></WorkspaceSubscreen>
                </Grid>:""}
                {openContentActive? <Grid item xs ={12} xl = {12}>
                    <EditToolbar isPublished={isPublished}></EditToolbar>
                </Grid>:""}
                <Grid item xs ={12} xl = {7} sx={{ p: 1, mt:4 }} >
                    {isPublished?<Typography sx={{fontWeight:'bold'}}>Published: {playlist.publishedDate}</Typography>:""}
                </Grid>
                <Grid item xs ={12} xl = {4} sx={{ p: 1, mt:4 }}>
                    {isPublished?<Typography sx={{fontWeight:'bold'}}>Listens: {playlist.listens}</Typography>:""}
                </Grid>
                <Grid item xs ={12} xl = {1} sx={{ p: 1}}>
                    {openContentActive?<Button onClick={toggleOpenContent} startIcon={<KeyboardDoubleArrowUpOutlinedIcon id = "list-card-button"/>}></Button >
                    :<Button onClick={toggleOpenContent} startIcon={<KeyboardDoubleArrowDownOutlinedIcon id = "list-card-button"/> }></Button >}
                </Grid>
            </Grid>
        </Box>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + playlist._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={playlist.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;