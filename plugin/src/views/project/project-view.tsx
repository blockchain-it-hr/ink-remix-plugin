import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ConsoleProvider } from '../../components/console';
import { useStateContext } from '../../state/store';
import ProjectContainer from './project-container';
import './project-view.scss';
import { ProjectProvider } from './state/project-provider';

const ProjectView: React.FC = () => {
    let params: any = useParams();

    const state = useStateContext();
    const project = state.projects[params.projectId];

    if (project === undefined) {
        const history = useHistory();
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
            <ConsoleProvider>
                <ProjectProvider>
                    <ProjectContainer project={project} />
                </ProjectProvider>
            </ConsoleProvider>  
        </div>
    );
}

export default ProjectView;