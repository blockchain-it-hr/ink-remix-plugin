import React from 'react';
import './loader.scss';

export interface LoaderProps {
    size: 'sm' | 'md' | 'lg';
    position: 'inline' | 'center';
}

const Loader: React.FC<LoaderProps> = ({ size, position }) => {

    const className = [`loader-${size}`, `loader--${position}`].join(' ');
    return <div className={className}></div>;
}

export default Loader;