import React, { useState, useEffect } from 'react';
import './Detective.css';
import cases from '../../data/detectiveData.json'
import { PointsDisplay, usePoints } from '../PointsDisplay/PointsDisplay';

const Detective = () => {
    const { addPoints, subtractPoints } = usePoints(); 
    const [currentCase, setCurrentCase] = useState(null);
    const [playerChoices, setPlayerChoices] = useState([]);
    const [tools, setTools] = useState({
        justiceScanner: true,
        lawCodeDecoder: true
    });

    const startNewCase = () => {
        const randomCase = cases[Math.floor(Math.random() * cases.length)];
        setCurrentCase(randomCase);
        setPlayerChoices([]);
    };

    const useJusticeScanner = () => {
        if (tools.justiceScanner) {
            setTools(prev => ({ ...prev, justiceScanner: false }));
        }
    };

    const useLawCodeDecoder = () => {
        if (tools.lawCodeDecoder) {
            setTools(prev => ({ ...prev, lawCodeDecoder: false }));
        }
    };

    const makeChoice = (choiceIndex) => {
        setPlayerChoices(prev => [...prev, choiceIndex]);
        if (currentCase.correctChoice === choiceIndex) {
            addPoints(10); 
            alert("Correct! You've identified the right constitutional article.");
        } else {
            subtractPoints(5);
            alert("Incorrect. Try again!");
        }
    };

    useEffect(() => {
        startNewCase();
    }, []);

    return (
        <>
        <PointsDisplay></PointsDisplay>
        <div className="detective-game">
            <div className="character-container">
                <div className="character neutral" />
            </div>

            <div className="game-content">
                <div className="game-header">
                    <h1>Constitutional Detective</h1>
                </div>

                {currentCase && (
                    <div className="case-container">
                        <h2>{currentCase.title}</h2>
                        <div className="case-description">
                            {currentCase.description}
                        </div>

                        <div className="tools-panel">
                            <button
                                onClick={useJusticeScanner}
                                disabled={!tools.justiceScanner}
                                className={`tool-button ${!tools.justiceScanner ? 'used' : ''}`}
                            >
                                Use Justice Scanner
                            </button>
                            <button
                                onClick={useLawCodeDecoder}
                                disabled={!tools.lawCodeDecoder}
                                className={`tool-button ${!tools.lawCodeDecoder ? 'used' : ''}`}
                            >
                                Use Law Code Decoder
                            </button>
                        </div>

                        <div className="evidence-panel">
                            <h3>Evidence</h3>
                            <ul>
                                {currentCase.evidence.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="choices-panel">
                            <h3>Select the Constitutional Article</h3>
                            <div className="choice-buttons">
                                {currentCase.choices.map((choice, index) => (
                                    <button
                                        key={index}
                                        onClick={() => makeChoice(index)}
                                        className="choice-button"
                                    >
                                        {choice}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={startNewCase}
                            className="next-case-button"
                        >
                            Next Case
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default Detective;
