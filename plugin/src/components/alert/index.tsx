import React, { useState } from 'react';
import './alert.scss';

export type AlertType = 'info' | 'warning' | 'error' | 'success'

export interface AlertProps {
    message: string,
    type: AlertType
}

export const Alert: React.FC<AlertProps> = ({ message, type }) => {
    return (
        <div className={`alert alert--${type}`}>
            <span className="alert__icon">
                <i className="fa fa-info-circle" aria-hidden="true"></i>
            </span>
            <span className="alert__content">{message}</span>
        </div>
    )
}

export const useAlert = () => {
    const [alert, setAlert] = useState(null);
    const component = alert ? <Alert {...alert} /> : null;
    return {
        AlertComponent: component,
        setAlert: (message: string, type: AlertType) => setAlert({ message, type }),
        clearAlert: () => setAlert(null)
    }
}

export default Alert;