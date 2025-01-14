export const handleEvidenceClick = (item, evidenceFound, setEvidenceFound, setCharacterState) => {
    if (!evidenceFound.includes(item)) {
        setEvidenceFound(prev => [...prev, item]);
        setCharacterState({
            expression: "surprised",
            position: "center",
            speech: `Interesting... This ${item.toLowerCase()} could be crucial evidence!`,
            isThinking: false,
            animation: "bounce"
        });
    }
};

export const makeChoice = (choiceIndex, currentCase, setGameScore, setCharacterState, setGamePhase, setFeedback) => {
    const isCorrect = choiceIndex === currentCase.correctChoice;
    setGameScore(prev => prev + (isCorrect ? 100 : -50));
    
    if (isCorrect) {
        setCharacterState({
            expression: "happy",
            position: "center",
            speech: "Excellent work! You have identified the correct constitutional violation!",
            isThinking: false,
            animation: "bounce"
        });
        setFeedback({
            message: "Case solved successfully! Great constitutional analysis!",
            type: "success"
        });
    } else {
        setCharacterState({
            expression: "thinking",
            position: "center",
            speech: "Not quite right. Lets review the evidence again.",
            isThinking: false,
            animation: ""
        });
        setFeedback({
            message: "That is not the correct constitutional article. Keep investigating!",
            type: "error"
        });
    }
    
    setGamePhase("feedback");
    
    setTimeout(() => {
        if (isCorrect) {
            setCharacterState(prev => ({
                ...prev,
                speech: "Ready for the next case?",
                animation: "entrance"
            }));
        }
    }, 3000);
};