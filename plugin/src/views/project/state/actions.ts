import { IBuildArtifacts, IProjectAction } from "./reducer"

export const setBuildArtifacts = (artifacts: IBuildArtifacts): IProjectAction => {
    return {
        type: 'set_artifacts', 
        payload: artifacts
    }
}