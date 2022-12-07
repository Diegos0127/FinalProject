import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUIDeleteModal from './MUIDeleteModal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import AddIcon from '@mui/icons-material/Add';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceSubscreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    
    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if(store.isDeleteListModalOpen()){
        modalJSX = <MUIDeleteModal />;
    }
    let songs = "";
    if(store.currentList){
        songs = store.currentList.songs.map((song, index) => (
            <SongCard
                id={'playlist-song-' + (index)}
                key={'playlist-song-' + (index)}
                index={index}
                song={song}
            />
        ))  
    }
    return (
        <Box>
        <List 
            id="playlist-cards" 
            sx={{ width: '100%' }}
        >
            {songs}
                <Button sx={{width:"100%",p: 1,color:'white',fontSize:'60px', maxHeight:'6vh', backgroundColor:'info.dark', borderRadius:'12px',
                '&:hover':{
                    backgroundColor:'info.dark'
                }}} 
                justifyContent="center"
                onClick={handleAddNewSong}>
                + 
            </Button>
            
         </List>            
         { modalJSX }
         </Box>
    )
}

export default WorkspaceSubscreen;
//<Box sx={{ display: 'flex', p: 1, backgroundColor:'info.dark', borderRadius:'12px'}} justifyContent="center" >