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
    
    function handleAddNewSong() {
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
            <Box className = {"song-card unselected-song-card"} sx={{ display: 'flex', p: 1, backgroundColor:'info.dark', textAlign:'center'}}
            style={{ width: '98%', fontSize: '20pt' }} >
                <Button
                sx={{color:'white',fontSize:'60px', maxHeight:'5vh', backgroundColor:'info.dark'}}
                onClick={handleAddNewSong}>
                + 
            </Button>
            </Box>
         </List>            
         { modalJSX }
         </Box>
    )
}

export default WorkspaceSubscreen;