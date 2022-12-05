import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey,purple} from '@mui/material/colors'
import {
    AppBanner,
    HomeScreen,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    SplashScreen,
    Statusbar,
    WorkspaceScreen
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const theme = createTheme({
    palette:{
        primary:grey,
        secondary:grey
    }
})
const App = () => {   
    return (
        <BrowserRouter>
        <ThemeProvider theme = {theme}>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App