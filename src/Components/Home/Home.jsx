import React from 'react';
import './Home.scss';

const Home = ({ onPlayGame }) => {
    return (
        <div className="Home">
            <div className="ParentDiv">
                <div onClick={() => onPlayGame('/SpinTheWheel')} className="child1"></div>
                <div onClick={() => onPlayGame('/mario')} className="child2"></div>
                <div onClick={() => onPlayGame('/quiz')} className="child3"></div>
            </div>
        </div>
    );
};

export default Home;
