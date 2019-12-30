import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Loader } from './components/common/loader';
import Header from './components/header';
import { setLoaded, setProjects } from './state/actions';
import { useDispatchContext, useStateContext } from './state/store';
import './styles/app.scss';
import { synchronizeProjects } from './utils';
import { remixClient } from './utils/remix-client';
import LandingView from './views/landing';
import ProjectView from './views/project';

const App: React.FC = () => {

    const state = useStateContext();
    const dispatch = useDispatchContext();

    useEffect(() => {
        const load = async () => {
            await remixClient.createClient();
            try {
                let projects = await synchronizeProjects();
                dispatch(setProjects(projects));
            } catch (ex) {
                console.error(ex);
            }
            setTimeout(() => dispatch(setLoaded()), 1000);
        }
        load();
    }, []);

    const Navigation = () => (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <LandingView />
                </Route>
                <Route exact path="/projects/:projectId" >
                    <ProjectView />
                </Route>
            </Switch>
        </BrowserRouter>
    );

    return (
        <div id="app">
            <Header />
            <main role="main">
                {!state.isLoaded ? <Loader size='md' position='center' /> : <Navigation />}
            </main>
        </div>
    );
}

export default App;