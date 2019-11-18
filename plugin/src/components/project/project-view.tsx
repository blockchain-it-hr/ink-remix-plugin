import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useStateContext } from '../../state/store';
import ArtifactsFragment from './fragments/artifacts-fragment';
import BuildFragment from './fragments/build-fragment';
import './project-view.scss';

const ProjectView: React.FC = () => {
    let history = useHistory();
    let params: any = useParams();

    const state = useStateContext();
    const project = state.projects.filter(p => p.projectId == params.projectId)[0];

    if (project === undefined) {
        history.push('/');
        return null;
    }

    return (
        <div className="section">
            <div className="section__title">
                <i className="fa fa-list-ul mr-2" aria-hidden="true"></i>
                <div className="breadcrumb">
                    <span className="breadcrumb__item breadcrumb__item--active">
                        <Link to='/'>Projects</Link>
                    </span>
                    <span className="breadcrumb__item">{project.projectName}</span>
                </div>   
            </div>
            <Tabs>
                <TabList>
                    <Tab>Build</Tab>
                    <Tab>Artifacts</Tab>
                </TabList>
                <TabPanel>
                    <BuildFragment />
                </TabPanel>
                <TabPanel >
                    <ArtifactsFragment />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default ProjectView;