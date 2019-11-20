import React from 'react';
import { useStateContext } from '../../state/store';
import { CreateProjectSegment, RecentProjectsSegment } from './components';
import './landing-view.scss';

const LandingView: React.FC = () => {
    const state = useStateContext();
    return (
        <div id="wrapper">
            <CreateProjectSegment />
            {Object.keys(state.projects).length > 0 && <RecentProjectsSegment projects={state.projects} />}
        </div>
    );
}

export default LandingView;