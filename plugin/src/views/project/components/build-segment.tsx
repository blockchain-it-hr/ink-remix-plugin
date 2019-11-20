import React from 'react';
import { useConsole } from '../../../components/console';
import inkService from '../../../ink';
import { IMessage } from '../../../ink/types';
import { IProject } from '../../../types';
import { remixClient } from '../../../utils/remix-client';

export interface BuildFragmentProps {
    project: IProject
}

const BuildFragment: React.FC<BuildFragmentProps> = ({ project }) => {
    let consoleManager = useConsole({ maxLength: 100 });
    
    const onMessage = async (message: IMessage, disconnect: () => void) => {
        switch (message.type) {
            case 'stdout': {
                consoleManager.push(message.payload);
                break;
            }
            case 'stderr': {
                consoleManager.push(message.payload);
                break;
            }
            case 'error': {
                consoleManager.push(message.payload, 'error');
                disconnect();
                break;
            }
            case 'build': {
                consoleManager.push('Build finished', 'success');
                disconnect();
                break;
            }
            default: 
                break;
        }
    }
    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const projectFiles = {
            lib:   await remixClient.getFile(`.ink/${project.projectName}/lib.rs`),
            cargo: await remixClient.getFile(`.ink/${project.projectName}/Cargo.toml`)
        };
        inkService.buildProject(Object.assign(project, projectFiles), onMessage);
    }

    return (
        <div id="build-segment">
            <form onSubmit={onSubmit}>
                <div className="group">
                    <button type="submit" className="btn btn--primary">
                        <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                        <span>Build</span>
                    </button>
                </div>
            </form>
            {consoleManager.Component}
        </div>
    );
}

export default BuildFragment;