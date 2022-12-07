import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { store } = useContext(GlobalStoreContext);
    const { isPublished } = props;

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
            {!isPublished?<Button
                onClick={handleDeleteList}
                id='add-song-button'
                variant="contained">
                Delete
            </Button>:" "}
            <Button 
                disabled={!store.canClose()}
                id='close-button'
                variant="contained">
                    Duplicate
            </Button>
        </div>
    )
}

export default EditToolbar;