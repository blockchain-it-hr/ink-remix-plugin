import React from 'react';
import './project-view.scss';
import { Link, useParams } from 'react-router-dom';

const ProjectView: React.FC = () => {
    let { projectId } = useParams();
    console.log(projectId);

    return <Link to='/'>Go back</Link>;
}

export default ProjectView;