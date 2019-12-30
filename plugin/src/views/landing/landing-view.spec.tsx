import * as React from "react";
import * as renderer from "react-test-renderer";
import LandingView from './landing-view';

test("should render LandingView component", () => {
    const tree = renderer
        .create(<LandingView />)
        .toJSON();
        
    expect(tree).toMatchSnapshot();
});