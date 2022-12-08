import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_CURRENT_PLAYING_LIST: "SET_CURRENT_PLAYING_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    OPEN_MODAL: "OPEN_MODAL",
    HIDE_MODALS: "HIDE_MODALS",
    GO_HOME: "GO_HOME",
    UPDATE_PLAYLISTS:"UPDATE_PLAYLISTS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}
const HomeSubscreen = {
    HOME : "HOME",
    ALL_PLAYLISTS: "ALL_PLAYLISTS",
    BY_USER_PLAYLISTS: "BY_USER_PLAYLISTS"
}
const sortBy = {
    EDIT : "edit",
    CREATION : "creation",
    NAME : "name",
    PUBLISH : "publish",
    LISTENS : "listens",
    LIKES: "likes",
    DISLIKES: "dislikes"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        currentList: null,
        currentPlayingList: null,
        currentSongIndex : -1,
        homeSubscreen: HomeSubscreen.HOME,
        playlists: null,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: null,
                    homeSubscreen: store.homeSubscreen,
                    currentPlayingList: store.currentPlayingList,
                    playlists: payload.playlists,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.UPDATE_PLAYLISTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: store.currentList,
                    homeSubscreen: store.homeSubscreen,
                    currentPlayingList: store.currentPlayingList,
                    playlists: payload.playlists,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: null,
                    homeSubscreen: store.homeSubscreen,
                    currentPlayingList: store.currentPlayingList,
                    playlists: store.playlists,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: payload,
                    currentSongIndex: -1,
                    homeSubscreen: store.homeSubscreen,
                    currentPlayingList: store.currentPlayingList,
                    playlists: store.playlists,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_PLAYLISTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: null,
                    homeSubscreen: payload.homeSubscreen,
                    playlists: payload.playlists,
                    currentPlayingList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    homeSubscreen: store.homeSubscreen,
                    playlists: store.playlists,
                    currentPlayingList: store.currentPlayingList,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist
                });
            }
            // CHANGE CURRENT LIST WHO IS EXPANDED
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: payload,
                    currentPlayingList: store.currentPlayingList,
                    homeSubscreen: store.homeSubscreen,
                    playlists: store.playlists,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // CHANGE CURRENT LIST WHO IS PLAYING
            case GlobalStoreActionType.SET_CURRENT_PLAYING_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: store.currentList,
                    homeSubscreen: store.homeSubscreen,
                    playlists: store.playlists,
                    currentPlayingList: payload,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: payload,
                    currentPlayingList: store.currentPlayingList,
                    homeSubscreen: store.homeSubscreen,
                    playlists: store.playlists,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // 
            case GlobalStoreActionType.OPEN_MODAL: {
                return setStore({
                    currentModal : payload.modal,
                    currentList: store.currentList,
                    currentPlayingList: store.currentPlayingList,
                    currentSongIndex: payload.currentSongIndex,
                    homeSubscreen: store.homeSubscreen,
                    playlists: store.playlists,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentList: store.currentList,
                    currentPlayingList: store.currentPlayingList,
                    homeSubscreen: store.homeSubscreen,
                    playlists: store.playlists,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
           
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS LOADS ALL THE PLAYLISTS OF THE CURRENTLY LOGGED IN USER AND GOES HOME
    store.loadUserPlaylists = function (nameCriterion) {
        tps.clearAllTransactions();
        async function asyncLoadUserPlaylists() {
            const response = await api.getUserPlaylists(nameCriterion);
            if (response.data.success) {
                let playlists = response.data.playlists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlists:playlists, homeSubscreen:HomeSubscreen.HOME}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadUserPlaylists();
    }
    // THIS FUNCTION LOADS ALL OF THE PUBLISH PLAYLISTS AND GOES TO THE ALL PLAYLISTS SUBCREEN
    store.loadAllPlaylists = function (nameCriterion) {
        tps.clearAllTransactions();
        async function asyncLoadAllPlaylists() {
            const response = await api.getPublishedPlaylists("name",nameCriterion);
            if (response.data.success) {
                let playlists = response.data.playlists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlists:playlists, homeSubscreen:HomeSubscreen.ALL_PLAYLISTS}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadAllPlaylists();
    }
    //GOES THE SUBSCREEN WHERE PLAYLISTS ARE SEARCHE BY USER, STARTS OUT NULL BEFORE SEARCHING
    store.byUser = function(userCriterion){
        tps.clearAllTransactions();
        if(userCriterion){
            async function asyncLoadByUserPlaylists() {
                const response = await api.getPublishedPlaylists("user", userCriterion);
                if (response.data.success) {
                    let playlists = response.data.playlists;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_PLAYLISTS,
                        payload: {playlists:playlists, homeSubscreen:HomeSubscreen.BY_USER_PLAYLISTS}
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadByUserPlaylists();
        }
        storeReducer({
            type: GlobalStoreActionType.LOAD_PLAYLISTS,
            payload: {
                playlists:null, homeSubscreen: HomeSubscreen.BY_USER_PLAYLISTS
            }
        });
    }
    //THIS FUNCTION PROCESSES SEARCH BAR REQUESTS
    store.search = function(search){
        let trimmedSearch = "";
        if(search)
            trimmedSearch = search.trim();
        if(trimmedSearch){
            if(store.homeSubscreen===HomeSubscreen.HOME)
                store.loadUserPlaylists(trimmedSearch);
            else if(store.homeSubscreen===HomeSubscreen.ALL_PLAYLISTS)
                store.loadAllPlaylists(trimmedSearch);
            else
                store.byUser(trimmedSearch);
        }
        else{
            storeReducer({
                type: GlobalStoreActionType.LOAD_PLAYLISTS,
                payload: {
                    playlists:null, homeSubscreen: store.homeSubscreen
                }
            });
        }
    }
    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let sameName = newName===playlist.name;
                playlist.name = newName;
                async function updateList(playlist) {
                    if(!sameName)
                        response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success||sameName) {
                        async function getPlaylists(playlist) {
                            response = await api.getUserPlaylists();
                            if (response.data.success) {
                                let playlists = response.data.playlists;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        playlist: playlist, 
                                        playlists:playlists
                                    }
                                });
                            }
                        }
                        getPlaylists(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function (songs,listName) {
        let newListName = "";
        if(listName)
            newListName = listName;
        else
            newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, songs, auth.user.email, auth.user.userName);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            store.playlists.push(newList);
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    
    //This function deals with sorting playlists by name,creation,last edit,"publish date",listens, like, dislikes
    store.sort = function(sortType) {
        console.log("Sorting by "+sortType);
        store.sortBy(sortType);
        storeReducer({
            type: GlobalStoreActionType.UPDATE_PLAYLISTS,
            payload: {playlists:store.playlists}
        });  
         
    }
    //This function deals with sorting playlists by name,creation,last edit,"publish date",listens, like, dislikes
    store.sortBy = function(sortType){
        if(!store.playlists){
            {};
        }
        else if(sortType==="name")
            store.playlists.sort(function(a,b){return (a.name).localeCompare(b.name)});
        else if(sortType==="creation")
            store.playlists.sort(function(a,b){return (a.createdAt).localeCompare(b.createdAt)});
        else if(sortType==="edit")
            store.playlists.sort(function(a,b){return (b.updatedAt).localeCompare(a.updatedAt)});
        else if(sortType==="publish")
            store.playlists.sort(function(a,b){return (b.publishedDate.split(",")[1])-(a.publishedDate.split(",")[1])});
        else if(sortType==="listens")
            store.playlists.sort(function(a,b){return b.listens-a.listens});
        else if(sortType==="likes")
            store.playlists.sort(function(a,b){return b.likes.length-a.likes.length});
        else if(sortType==="dislikes")
            store.playlists.sort(function(a,b){return b.dislikes.length-a.dislikes.length});
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function () {
        let id = store.currentList._id;
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadUserPlaylists();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    store.unmarkListForDeletion = function() {
        store.loadUserPlaylists();
        store.hideModals();
    }
    store.publishPlaylist = async function(){
        var now = new Date();
        let publishedDate = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()+ ","+Date.now();
        store.currentList.publishedDate = publishedDate;
        const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
        if (response.status === 200) {
            var foundPlaylist = store.playlists.find(function(element){
                return element._id === store.currentList._id;
            })
            foundPlaylist.publishedDate = publishedDate;
            storeReducer({
                type: GlobalStoreActionType.UPDATE_PLAYLISTS,
                payload: {playlists:store.playlists}
            });     
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
       
    }
   
    store.thumbsPlaylist = async function(id, like) {
        var foundPlaylist = store.playlists.find(function(element){
            return element._id === id;
        })
        var foundLiker = foundPlaylist.likes.find(function(element){
            return element === auth.user.userName;
        }) 
        //Remove like
        if(foundLiker)
            foundPlaylist.likes.splice(foundPlaylist.likes.filter(function(item){
                return item !==foundLiker
            }),1)
        //Add like
        else if(like)
            foundPlaylist.likes.push(auth.user.userName)
        var foundDisliker = foundPlaylist.dislikes.find(function(element){
            return element === auth.user.userName;
        })
        //Remove dislike
        if(foundDisliker)
            foundPlaylist.dislikes.splice(foundPlaylist.dislikes.filter(function(item){
                return item !==foundDisliker
            }),1)
        //Add dislike
        else if(!like)
            foundPlaylist.dislikes.push(auth.user.userName)
        const response = await api.updatePlaylistById(id, foundPlaylist);
        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_PLAYLISTS,
                payload: {playlists:store.playlists}
            });   
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.OPEN_MODAL,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit, modal:CurrentModal.EDIT_SONG}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.OPEN_MODAL,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove, modal:CurrentModal.REMOVE_SONG}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    
                }
            }
        }
        asyncSetCurrentList(id);
    }
    //CHANGES WHICH PLAYLIST IS CURRENTLY PLAYING
    store.setCurrentPlayingList = function (id) {
        async function asyncSetCurrentPlayingList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_PLAYING_LIST,
                        payload: playlist
                    });
                    
                }
            }
        }
        asyncSetCurrentPlayingList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                console.log('success');
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }
    store.isHome = function() {
        console.log(store.homeSubscreen)
        return store.homeSubscreen === HomeSubscreen.HOME;
    }
    store.isCurrentPublished = function(){
        if(store.currentList)
            return store.currentList.publishedDate !== "1970-00-01,0";
        return true;
    }
    store.isListOpen = function(id){
        if(!store.currentList)
            return  false;
        return store.currentList._id === id;
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }
    store.getUserName = function() {
        return auth.user.userName;
    }
    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };