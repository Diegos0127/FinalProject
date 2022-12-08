import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Button from '@mui/material/Button';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let isPublished = store.isCurrentPublished();
    let owner = false;
    if(store.currentList&&auth.loggedIn)
        owner = store.currentList.ownerUserName === store.getUserName();
    async function handleDeleteList(event) {
        event.stopPropagation();
        store.markListForDeletion();
    }

    function handleUndo(event) {
        event.stopPropagation();
        store.undo();
    }

    function handleRedo(event) {
        event.stopPropagation();
        store.redo();
    }

    function handlePublish(event) {
        event.stopPropagation();
        store.publishPlaylist();
    }
    function handleDuplicateList(event){
        event.stopPropagation();
        store.createNewList(store.currentList.songs, store.currentList.name);
    }
    return (
        <div>
            {!isPublished?<Button 
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    Undo
            </Button>:" "}
            {!isPublished?<Button 
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    Redo
            </Button>:" "}
            {!isPublished?<Button
                id='add-song-button'
                onClick = {handlePublish}
                variant="contained">
                Publish
            </Button>:" "}
            {store.isHome()?<Button
                onClick={handleDeleteList}
                id='add-song-button'
                variant="contained">
                Delete
            </Button>:" "}
            {auth.loggedIn?<Button 
                disabled={!store.canClose()}
                id='close-button'
                onClick={handleDuplicateList}
                variant="contained">
                    Duplicate
            </Button>:""}
        </div>
    )
}

export default EditToolbar;