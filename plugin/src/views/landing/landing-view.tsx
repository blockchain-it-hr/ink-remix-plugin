import React from 'react';
import { useStateContext } from '../../state/store';
import { CreateProject, RecentProjects } from './components';
import './landing-view.scss';

const LandingView: React.FC = () => {
    const state = useStateContext();
    return (
        <div id="wrapper">
            <CreateProject />
            {Object.keys(state.projects).length > 0 && <RecentProjects projects={state.projects} />}
        </div>
    );
}

export default LandingView;