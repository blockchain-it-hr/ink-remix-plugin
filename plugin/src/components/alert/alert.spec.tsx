import * as React from "react";
import * as renderer from "react-test-renderer";
import { Alert, AlertProps } from "./index";

test("should render Alert component", () => {
    const props: AlertProps = {
        message: 'test',
        type: 'info'
    };
    const tree = renderer
        .create(<Alert {...props} />)
        .toJSON();
        
    expect(tree).toMatchSnapshot();
});