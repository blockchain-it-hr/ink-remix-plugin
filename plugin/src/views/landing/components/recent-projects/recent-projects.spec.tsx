import * as React from "react";
import * as renderer from "react-test-renderer";
import uuidv4 from 'uuid/v4';
import RecentProjects from './recent-projects';
import { MemoryRouter } from "react-router-dom";

test("should render RecentProjects component", () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const now  = new Date();
    
    const projects = [
        {
            projectId: uuidv4(),
            projectName: 'test',
            createdAt: now.toLocaleDateString('en-US', options)
        }
    ];

    const tree = renderer
        .create(
            <MemoryRouter>
                <RecentProjects projects={projects} />
            </MemoryRouter> 
        ).toJSON();
        
    expect(tree).toMatchSnapshot();
});