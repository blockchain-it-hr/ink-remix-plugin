import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { BuildSegment, ArtifactSegment } from './components';

const ProjectContainer = ({ project }) => {
    return (
        <Tabs forceRenderTabPanel={true}>
            <TabList>
                <Tab>Build</Tab>
                <Tab>Artifacts</Tab>
            </TabList>
            <TabPanel>
                <BuildSegment project={project} />
            </TabPanel>
            <TabPanel >
                <ArtifactSegment />
            </TabPanel>
        </Tabs>
    );
}

export default ProjectContainer;