import React, { useState } from "react";
import inkService from '../../../ink';
import { IMessage } from "../../../ink/types";
import { newProject } from "../../../state/actions";
import { useDispatchContext } from "../../../state/store";
import { remixClient } from "../../../utils/remix-client";

const CreateProjectSegment: React.FC = () => {

    const dispatch = useDispatchContext();
    const [state, setState] = useState({ projectName: null });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ projectName: e.currentTarget.value });
    }

    const onMessage = async (message: IMessage, disconnect: () => void) => {
        switch (message.type) {
            case 'project': {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const now  = new Date();

                let project = message.payload;
                project.createdAt = now.toLocaleDateString('en-US', options);

                await remixClient.createFile(`.ink/${project.projectName}/lib.rs`, project.lib);
                await remixClient.createFile(`.ink/${project.projectName}/Cargo.toml`, project.cargo);
                
                dispatch(newProject(project));
                disconnect();
                break;
            }
            case 'error': {
                console.log(message.payload);
                disconnect();
                break;
            }
            default: 
                break;
        }
    }
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        inkService.createProject({ projectName: state.projectName }, onMessage);
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
                        placeholder="Contract name" 
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

export default CreateProjectSegment;