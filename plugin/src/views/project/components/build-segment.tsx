import React from 'react';
import { Console, onLog, useConsoleContext } from '../../../components/console';
import inkService from '../../../ink';
import { IMessage } from '../../../ink/types';
import { IProject } from '../../../types';
import { base64ToUint8Array } from '../../../utils';
import { remixClient } from '../../../utils/remix-client';
import { setBuildArtifacts } from '../state/actions';
import { useProjectContext } from '../state/project-provider';

export interface BuildSegmentProps {
    project: IProject
}

const BuildSegment: React.FC<BuildSegmentProps> = ({ project }) => {
    let consoleContext = useConsoleContext();
    let projectContext = useProjectContext();

    const onMessage = async (message: IMessage, disconnect: () => void) => {
        switch (message.type) {
            case 'stdout': {
                consoleContext.dispatch(onLog(message.payload));
                break;
            }
            case 'stderr': {
                consoleContext.dispatch(onLog(message.payload));
                break;
            }
            case 'error': {
                consoleContext.dispatch(onLog(message.payload, 'error'));
                disconnect();
                break;
            }
            case 'build': {
                consoleContext.dispatch(onLog('Build finished', 'success'));
                projectContext.dispatch(
                    setBuildArtifacts({
                        wasm: base64ToUint8Array(message.payload.wasm),
                        abi: message.payload.abi
                    })
                )
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
            <Console />
        </div>
    );
}

export default BuildSegment;