export interface IBuildArtifacts {
    wasm: Uint8Array,
    abi: string
}

export interface IProjectState {
    artifacts: IBuildArtifacts
}

export interface IProjectAction {
    type: 'set_artifacts',
    payload?: any
}

export const projectReducer = (state: IProjectState, action: IProjectAction) => {
    switch (action.type) {
        case 'set_artifacts':
            return {
                ...state,
                artifacts: action.payload
            };
        default:
            return state;
    }
}