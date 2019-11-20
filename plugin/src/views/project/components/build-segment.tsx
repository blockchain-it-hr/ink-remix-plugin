import React from 'react';
import { useConsole } from '../../../components/console';
import inkService from '../../../ink';
import { IMessage, IProject } from '../../../ink/types';

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
                console.error(message.payload);
                disconnect();
                break;
            }
            case 'build': {
                consoleManager.push("Build successful");
                disconnect();
                break;
            }
            default: 
                break;
        }
    }
    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // TODO: synchronize lib.rs and Cargo.toml before building
        inkService.buildProject(project, onMessage);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="group">
                    <button type="submit" className="btn btn--primary">
                        <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                        <span>Build</span>
                    </button>
                </div>
            </form>
            {consoleManager.Component}
        </>
    );
}

export default BuildFragment;