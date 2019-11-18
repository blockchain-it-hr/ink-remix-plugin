import React, { useState } from "react";
import uuidv4 from 'uuid/v4';
import { newProject } from "../../../state/actions";
import { useDispatchContext } from "../../../state/store";

const CreateProjectFragment: React.FC = () => {

    const dispatch = useDispatchContext();
    const [state, setState] = useState({ projectName: null });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ projectName: e.currentTarget.value });
    }
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const now  = new Date();

        const project = {
            projectId: uuidv4(),
            projectName: state.projectName,
            createdAt: now.toLocaleDateString('en-US', options)
        };

        // TODO: ws logic
        dispatch(newProject(project));
    }   

    return (
        <div className="section">
            <div className="section__title">
                <i className="fa fa-rocket fa-lg mr-2" aria-hidden="true"></i>
                <span>Create project</span>
            </div>
            <form onSubmit={onSubmit}>
                <div className="group">
                    <label htmlFor="projectName">Project name</label>
                    <input type="text" 
                        className="form-control" 
                        name="projectName" 
                        placeholder="e.g. Flipper" 
                        onChange={onChange} 
                        required={true} />
                </div>
                <div className="group">
                    <button type="submit" className="btn btn--primary">
                        <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                        <span>Create project</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateProjectFragment;