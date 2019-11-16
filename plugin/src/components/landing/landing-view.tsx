import React from 'react';
import { useStateContext } from '../../state/store';
import { CreateProjectFragment, RecentProjectsFragment } from './fragments';
import './landing-view.scss';

const LandingView: React.FC = () => {
    const state = useStateContext();
    return (
        <div id="container">
            <CreateProjectFragment />
            {state.projects.length > 0 && <RecentProjectsFragment projects={state.projects} />}
        </div>
    );
}

export default LandingView;