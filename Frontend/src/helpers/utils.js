import React, { useState, useEffect } from 'react';

function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every 1 minute (60,000 milliseconds)
    return () => clearInterval(intervalId);
  }, []);

  // Function to format the current time in "Day HH:MM AM/PM" format
  const formatTime = (time) => {
    if (!(time instanceof Date) || isNaN(time)) {
        return 'Invalid Date'; // Handle invalid dates
      }
    
    const options = {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return time.toLocaleDateString(undefined, options);
  };

  return (
  
      <p>{formatTime(currentTime)}</p>
 
  );
}

export default CurrentTime;
