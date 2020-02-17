import * as React from "react";
import * as renderer from "react-test-renderer";
import { Loader, LoaderProps } from "./index";

test("should render Loader component", () => {
    const props: LoaderProps = {
        size: 'md',
        position: 'center'
    };
    const tree = renderer
        .create(<Loader {...props} />)
        .toJSON();
        
    expect(tree).toMatchSnapshot();
});