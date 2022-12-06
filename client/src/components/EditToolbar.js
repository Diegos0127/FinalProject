import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair} = props;

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        
        store.markListForDeletion(id);
    }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    return (
        <div id="edit-toolbar">
            <Button 
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    Undo
            </Button>
            <Button 
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    Redo
            </Button>
            <Button
                
                id='add-song-button'
                
                variant="contained">
                Publish
            </Button>
            <Button
                onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }}
                id='add-song-button'
                variant="contained">
                Delete
            </Button>
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