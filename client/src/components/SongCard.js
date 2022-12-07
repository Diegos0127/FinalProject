import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        event.stopPropagation();
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        event.stopPropagation();
        if (event.detail === 2) 
            store.showEditSongModal(index, song);
    }
    
    let cardClass = "song-card unselected-song-card";
    return (
        <Box
            key={index}
            id={'song-' + index + '-card'}
            sx={{ display: 'flex', p: 1, backgroundColor:'info.dark', color:'white'}}
            style={{ width: '98%', fontSize: '20pt' }}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>
                {index + 1}. {song.title} by {song.artist}
            </Box>
            {!store.isCurrentPublished()?<Box sx={{height:"75%"}}>
                <IconButton onClick={handleRemoveSong} aria-label='delete'>
                    <CloseIcon style={{fontSize:'36pt', color: 'white'}} />
                </IconButton>
            </Box>:""}
        </Box>
    );
}

export default SongCard;