import React from 'react';
import useConsole from '../../console/console-hook';

const BuildFragment: React.FC = () => {

    let consoleManager = useConsole({ maxLength: 20 });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        consoleManager.push('Hello world!'); // TODO: add actual logs
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="group">
                    <button type="submit" className="btn btn--primary">
                        <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                        <span>Build</span>
                    </button>
                </div>
            </form>
            {consoleManager.Component}
        </>
    );
}

export default BuildFragment;