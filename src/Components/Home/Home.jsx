import React, { useState } from 'react';
import './Home.scss';

const Home = ({ onPlayGame }) => {
    const [overlayVisible, setOverlayVisible] = useState(true);

    const handleOverlayClick = () => {
        setOverlayVisible(false);
    };

    return (
        <div className="Home">
            {overlayVisible && (
                <div className='overlay-home' onClick={handleOverlayClick}>
                    {/* <h1>Constitutional Explorer
                        <br></br><br></br><br></br>
                        Click anywhere to start
                    </h1> */}
                </div>
            )}
            <div className="ParentDiv">
                <div onClick={() => onPlayGame('/SpinTheWheel')} className="child1"></div>
                <div onClick={() => onPlayGame('/mario')} className="child2"></div>
                <div onClick={() => onPlayGame('/quiz')} className="child3"></div>
            </div>
            <div className="ParentDiv">
                <div onClick={() => onPlayGame('/ludo')} className="child4"></div>
                <div onClick={() => onPlayGame('/detective')} className="child5"></div>
            </div>
        </div>
    );
};

export default Home;
