import React, { useState } from 'react';
import { Console, onLog, useConsoleContext } from '../../../components/console';
import inkService from '../../../ink';
import { IMessage } from '../../../ink/types';
import { IProject } from '../../../types';
import { base64ToUint8Array } from '../../../utils';
import { remixClient } from '../../../utils/remix-client';
import { setBuildArtifacts } from '../state/actions';
import { useProjectContext } from '../state/project-provider';
import { useAlert } from '../../../components/alert';

export interface BuildSegmentProps {
    project: IProject
}

const BuildSegment: React.FC<BuildSegmentProps> = ({ project }) => {
    
    let consoleContext = useConsoleContext();
    let projectContext = useProjectContext();
    const alertManager = useAlert();

    const [state, setState] = useState({
        isBuilding: false
    });

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
                setState({ isBuilding: false });
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
                setState({ isBuilding: false });
                alertManager.clearAlert();
                disconnect();
                break;
            }
            default: 
                break;
        }
    }
    

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alertManager.clearAlert();
        setState({ isBuilding: true });

        try {
            const projectFiles = {
                lib:   await remixClient.getFile(`.ink/${project.projectName}/lib.rs`),
                cargo: await remixClient.getFile(`.ink/${project.projectName}/Cargo.toml`)
            };
            
            alertManager.setAlert('Build process may take some time...', 'warning');
            inkService.buildProject(Object.assign(project, projectFiles), onMessage);
        } catch (e) {
            setState({ isBuilding: false });
            alertManager.setAlert(e.toString(), 'error');
            console.error(e);
        }
    }

    return (
        <div id="build-segment">
            <form onSubmit={onSubmit}>
                <div className="group">
                    <button type="submit" className="btn btn--primary" disabled={state.isBuilding}>
                        <i className={"fa fa-refresh mr-2".concat(state.isBuilding ? " spin" : "")} aria-hidden="true"></i>
                        <span>Build</span>
                    </button>
                </div>
            </form>
            {alertManager.AlertComponent}
            <Console />
        </div>
    );
}

export default BuildSegment;
