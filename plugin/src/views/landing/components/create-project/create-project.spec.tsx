import * as React from "react";
import * as renderer from "react-test-renderer";
import CreateProjectSegment from './create-project';

test("should render CreateProjectSegment component", () => {
    const tree = renderer
        .create(<CreateProjectSegment />)
        .toJSON();
        
    expect(tree).toMatchSnapshot();
});