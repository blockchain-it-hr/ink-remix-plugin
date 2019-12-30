import * as React from "react";
import * as renderer from "react-test-renderer";
import { ConsoleProvider } from "./console-provider";
import { Console } from "./index";

test("should render Console component", () => {
    const tree = renderer
        .create(
            <ConsoleProvider>
                <Console />
            </ConsoleProvider>
        ).toJSON();

    expect(tree).toMatchSnapshot();
});