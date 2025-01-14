import React from "react";
import { PointsDisplay } from "../PointsDisplay/PointsDisplay";

const Mario = () => {
  return (
    <div>
      <PointsDisplay></PointsDisplay>
      <iframe 
        src="/game.html" 
        width="100%" 
        height="1000" 
        title="Game"
      />
    </div>
  );
};

export default Mario;
