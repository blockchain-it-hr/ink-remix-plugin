import saveAs from 'file-saver';
import React from 'react';
import { ProjectConsumer } from '../state/project-provider';
import './artifact-segment.scss';

interface ArtifactSegmentProps {
    projectName: string
}

const ArtifactSegment: React.FC<ArtifactSegmentProps> = ({ projectName }) => {
    const onDownload = (buffer: any, outputName: string, type: string) => {
        var blob = new Blob([buffer], { type });
        saveAs(blob, outputName);
    }

    const wasmOutput = `${projectName}.wasm`;
    return (
        <ProjectConsumer>
            {({ state }) => {
                return (
                    <div id="artifacts-segment">
                        <div className="artifact-group">
                            <div className="artifact-group__item">
                                <span className="name">{wasmOutput}</span>
                                <a href="#" onClick={() => onDownload(state.artifacts.wasm, wasmOutput, 'application/octet-stream')}>
                                    <i className="fa fa-download fa-lg" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                        <div className="artifact-group">
                            <div className="artifact-group__item">
                                <span className="name">metadata.json</span>
                                <a href="#" onClick={() => onDownload(state.artifacts.abi, 'metadata.json', 'text/plain;charset=utf-8')}>
                                    <i className="fa fa-download fa-lg" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                );
            }}
        </ProjectConsumer>    
    )
}

export default ArtifactSegment;