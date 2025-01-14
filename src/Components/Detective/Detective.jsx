import React, { useState, useEffect } from 'react';
import './Detective.css';

const Detective = () => {
    const [currentCase, setCurrentCase] = useState(null);
    const [playerChoices, setPlayerChoices] = useState([]);
    const [gameScore, setGameScore] = useState(0);
    const [tools, setTools] = useState({
        justiceScanner: true,
        lawCodeDecoder: true
    });

    const cases = [
        {
            id: 1,
            title: "The School Admission Case",
            description: "A talented student from a minority community was denied admission to a prestigious school despite meeting all qualifications.",
            evidence: ["Admission Letter", "School Policy Document", "Student Records"],
            constitutionalViolation: "Article 15 - Prohibition of discrimination",
            choices: [
                "Article 14 - Equality before law",
                "Article 15 - Prohibition of discrimination",
                "Article 16 - Equality of opportunity in public employment",
                "Article 21 - Right to life and personal liberty"
            ],
            correctChoice: 1
        },
        {
            id: 2,
            title: "The Freedom of Speech Case",
            description: "A journalist was arrested for publishing an article critical of government policies.",
            evidence: ["Arrest Warrant", "Published Article", "Press Freedom Index"],
            constitutionalViolation: "Article 19 - Freedom of speech and expression",
            choices: [
                "Article 19 - Freedom of speech and expression",
                "Article 20 - Protection in respect of conviction for offences",
                "Article 21 - Right to life and personal liberty",
                "Article 22 - Protection against arrest and detention in certain cases"
            ],
            correctChoice: 0
        },
        {
            id: 3,
            title: "The Religious Freedom Case",
            description: "A group of citizens were denied permission to build a place of worship in their neighborhood.",
            evidence: ["Building Permit Rejection", "Local Zoning Laws", "Community Petition"],
            constitutionalViolation: "Article 25 - Freedom of conscience and free profession, practice and propagation of religion",
            choices: [
                "Article 23 - Prohibition of traffic in human beings and forced labour",
                "Article 24 - Prohibition of employment of children in factories, etc.",
                "Article 25 - Freedom of conscience and free profession, practice and propagation of religion",
                "Article 26 - Freedom to manage religious affairs"
            ],
            correctChoice: 2
        },
        {
            id: 4,
            title: "The Child Labor Case",
            description: "A factory was found employing children under the age of 14 in hazardous working conditions.",
            evidence: ["Factory Inspection Report", "Employee Records", "Child Labor Laws"],
            constitutionalViolation: "Article 24 - Prohibition of employment of children in factories, etc.",
            choices: [
                "Article 14 - Equality before law",
                "Article 15 - Prohibition of discrimination",
                "Article 16 - Equality of opportunity",
                "Article 21 - Right to education"
            ],
            correctChoice: 1
        },
        {
            id: 5,
            title: "The Right to Education Case",
            description: "A child from a low-income family was denied admission to a local school due to inability to pay fees.",
            evidence: ["School Fee Structure", "Family Income Certificate", "Right to Education Act"],
            constitutionalViolation: "Article 21A - Right to Education",
            choices: [
                "Article 21 - Right to life and personal liberty",
                "Article 21A - Right to Education",
                "Article 22 - Protection against arrest and detention in certain cases",
                "Article 23 - Prohibition of traffic in human beings and forced labour"
            ],
            correctChoice: 1
        },
        {
            id: 6,
            title: "The Environmental Rights Case",
            description: "A factory is polluting a river, affecting the health and livelihood of nearby residents.",
            evidence: ["Water Quality Report", "Health Impact Assessment", "Environmental Laws"],
            constitutionalViolation: "Article 21 - Right to life and personal liberty (includes right to clean environment)",
            choices: [
                "Article 19 - Freedom of speech and expression",
                "Article 20 - Protection in respect of conviction for offences",
                "Article 21 - Right to life and personal liberty",
                "Article 22 - Protection against arrest and detention in certain cases"
            ],
            correctChoice: 2
        },
        {
            id: 7,
            title: "The Labor Rights Case",
            description: "Workers in a factory are being forced to work overtime without additional pay.",
            evidence: ["Employee Timesheets", "Factory Regulations", "Labor Laws"],
            constitutionalViolation: "Article 23 - Prohibition of traffic in human beings and forced labour",
            choices: [
                "Article 21 - Right to life and personal liberty",
                "Article 22 - Protection against arrest and detention in certain cases",
                "Article 23 - Prohibition of traffic in human beings and forced labour",
                "Article 24 - Prohibition of employment of children in factories, etc."
            ],
            correctChoice: 2
        }
        // More cases can be added here
    ];

    const startNewCase = () => {
        const randomCase = cases[Math.floor(Math.random() * cases.length)];
        setCurrentCase(randomCase);
        setPlayerChoices([]);
    };

    const useJusticeScanner = () => {
        if (tools.justiceScanner) {
            // Highlight key evidence in the case
            setTools(prev => ({ ...prev, justiceScanner: false }));
        }
    };

    const useLawCodeDecoder = () => {
        if (tools.lawCodeDecoder) {
            // Provide hints about relevant constitutional articles
            setTools(prev => ({ ...prev, lawCodeDecoder: false }));
        }
    };

    const makeChoice = (choiceIndex) => {
        setPlayerChoices(prev => [...prev, choiceIndex]);
        if (currentCase.correctChoice === choiceIndex) {
            setGameScore(prev => prev + 10);
            alert("Correct! You've identified the right constitutional article.");
        } else {
            alert("Incorrect. Try again!");
        }
    };

    useEffect(() => {
        startNewCase();
    }, []);

    return (
        <div className="detective-game">
            <div className="character-container">
                <div className="character neutral" />
            </div>
            
            <div className="game-content">
                <div className="game-header">
                    <h1>Constitutional Detective</h1>
                    <div className="score">Score: {gameScore}</div>
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
    );
};

export default Detective;