import React, { createContext, useContext, useState, useEffect } from 'react';
import './PointsDisplay.scss';

const PointsContext = createContext();

export const PointsProvider = ({ children, user }) => {
  const [points, setPoints] = useState(user?.points || 0); // Safely handle user being null or undefined

  useEffect(() => {
    if (user) {
      setPoints(user.points);  // Update points if user data changes
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return () => {
      localStorage.removeItem('currentUser');
    };
  }, [user]);

  const savePoints = async (updatedPoints) => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:5000/update-points', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, points: updatedPoints }),
      });

      if (!response.ok) {
        throw new Error('Failed to update points');
      }

      const data = await response.json();
      console.log('Points updated:', data.updatedPoints);
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  const addPoints = (amount) => {
    setPoints((prev) => {
      const newPoints = prev + amount;
      savePoints(newPoints);
      return newPoints;
    });
  };

  const subtractPoints = (amount) => {
    setPoints((prev) => {
      const newPoints = Math.max(0, prev - amount);
      savePoints(newPoints);
      return newPoints;
    });
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, subtractPoints, savePoints, user }}>
      {children}
    </PointsContext.Provider>
  );
};

export const PointsDisplay = () => {
  const { points, user } = useContext(PointsContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch the user data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  return (
    <div className="points-container">
      <div className="points-display">
        {currentUser ? (
          <>
            <p>Player: {currentUser.name}</p>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
        <span><strong>Points:</strong> {points}</span>
      </div>
    </div>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
