import React, { useState, useRef } from "react";
import { usePoints } from "../PointsDisplay/PointsDisplay";
import { PointsDisplay } from "../PointsDisplay/PointsDisplay";
import "./Spinthewheel.scss";
import wheelData from '../../data/wheeldata.json'
 
const SpinningWheel = () => {
  const { addPoints } = usePoints();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const wheelRef = useRef(null);
  const audioRef = useRef(null);

  const handleCompletion = () => {
    if (!isCompleted) {
      addPoints(5);
      setIsCompleted(true);
    }
  };

  const segments = wheelData.segments;
  React.useEffect(() => {
    audioRef.current=new Audio('/spin-sound.mp4') // Changed to MP4
        audioRef.current.preload = 'auto';
        return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setSelectedOption(null); 
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset audio to start
        audioRef.current.play().catch(error => {
          console.error("Audio play error:", error);
        });
      }

      const minSpins = 5;
      const extraSpins = Math.random() * 5;
      const totalSpins = minSpins + extraSpins;
      const degrees = totalSpins * 360;

      const randomStop = Math.random() * 360;
      const finalRotation = degrees + randomStop;
      setRotation((prevRotation) => (prevRotation % 360) + finalRotation);

      setTimeout(() => {
        const normalizedRotation = (360 - (finalRotation % 360)) % 360;
        const segmentAngle = 360 / segments.length;
        const pointerOffset = segmentAngle / 2;
        const adjustedRotation = (normalizedRotation + pointerOffset) % 360;
        const selectedIndex = Math.floor(adjustedRotation / segmentAngle);
        setSelectedOption(segments[selectedIndex]);
        setIsSpinning(false);
        
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 5000);
    }
  };

  const getSegmentPath = (index, total) => {
    const centerX = 300;
    const centerY = 300;
    const radius = 280;
    const startAngle = (index * 360) / total;
    const endAngle = ((index + 1) * 360) / total;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    return `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2}Z`;
  };

  return (
    <div className="flex-center">
      <PointsDisplay></PointsDisplay>
      <h1 className="heading">Constitution Roulette</h1>
      <div className="wheel-layout">
        <div className="wheel-container">
          <div className="outer-glow" />
          <svg
            viewBox="0 0 600 600"
            ref={wheelRef}
            className="svg-wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.2, 0.8, 0.3, 0.99)"
                : "none",
            }}
          >
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={getSegmentPath(index, segments.length)}
                  fill={segment.color}
                  stroke="#FFD700"
                  strokeWidth="3"
                />
                <text
                  x="300"
                  y="300"
                  transform={`rotate(${(index * 360) / segments.length +
                    360 / segments.length / 2} 300 300) translate(0, -220)`}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {segment.title.split(" ").map((word, i) => (
                    <tspan x="300" dy={i === 0 ? 0 : "1.2em"} key={i}>
                      {word}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}
            <circle cx="300" cy="300" r="50" fill="#800080" />
            <circle cx="300" cy="300" r="45" fill="#FF00FF" />
            <text
              x="300"
              y="300"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="24"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >  
            </text>
          </svg>
          <div className="pointer">
            <div className="pointer-triangle" />
          </div>
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`spin-button ${isSpinning ? "disabled" : ""}`}
          >
            {isSpinning ? "..." : "SPIN!"}
          </button>
          <button
              onClick={handleCompletion}
              disabled={isCompleted}
              className="complete-button"
            >
              {isCompleted ? 'Completed!' : 'Mark as Complete'}
            </button>
        </div>
        {selectedOption && (
        <div className="result-container">
          <div className="result">
          <h2 className="result-title">Today's topic</h2>
          <div className="selected-option">
            <div
              className="color-box"
              style={{ backgroundColor: selectedOption.color }}
            ></div>
            <span className="selected-title">{selectedOption.title}</span>
          </div>
          </div>
          
          <div className="topic-information">
            <div className="info-description">
              <h3>Description</h3>
              <p className="content-details">{selectedOption.info.description}</p>
            </div>
            
            <div className="info-key-points">
              <h3>Key Points</h3>
              <ul>
                {selectedOption.info.keyPoints.map((point, index) => (
                  <li className='content-realted' key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="info-importance">
              <h3>Importance</h3>
              <p className="selected-content">{selectedOption.info.importance}</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SpinningWheel;