import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ArtifactSegment, BuildSegment } from './components';
import { useProjectContext } from './state/project-provider';

const ProjectContainer = ({ project }) => {
    const { state } = useProjectContext();
    return (
        <Tabs forceRenderTabPanel={true}>
            <TabList>
                <Tab>Build</Tab>
                <Tab disabled={!state.artifacts}>Artifacts</Tab>
            </TabList>
            <TabPanel>
                <BuildSegment project={project} />
            </TabPanel>
            <TabPanel>
                <ArtifactSegment projectName={project.projectName} />
            </TabPanel>
        </Tabs>
    );
}

export default ProjectContainer;