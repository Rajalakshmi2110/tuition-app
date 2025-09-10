import React, { useState, useEffect } from 'react';

const StudentTimer = () => {
  const [activeTab, setActiveTab] = useState('timer');
  
  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerTime, setTimerTime] = useState(25 * 60);
  
  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime(time => time - 1);
      }, 1000);
    } else if (timerTime === 0) {
      setTimerActive(false);
      alert('⏰ Timer finished!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerTime]);

  // Stopwatch Effect
  useEffect(() => {
    let interval = null;
    if (stopwatchActive) {
      interval = setInterval(() => {
        setStopwatchTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchActive]);



  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  const startTimer = () => {
    setTimerTime(timerMinutes * 60 + timerSeconds);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerTime(timerMinutes * 60 + timerSeconds);
  };

  const resetStopwatch = () => {
    setStopwatchActive(false);
    setStopwatchTime(0);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        ⏲️ Timer & Stopwatch
      </h2>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '2rem', gap: '1rem', justifyContent: 'center' }}>
        {['timer', 'stopwatch'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'white',
              color: activeTab === tab ? 'white' : '#374151',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease'
            }}
          >
            {tab === 'timer' ? '⏲️ Timer' : '⏱️ Stopwatch'}
          </button>
        ))}
      </div>

      {/* Timer Tab */}
      {activeTab === 'timer' && (
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '2rem', color: '#20205c', fontSize: '1.5rem' }}>⏲️ Set Timer</h3>
          
          {/* Timer Display */}
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: timerActive ? '#ef4444' : '#3b82f6',
            marginBottom: '2rem',
            fontFamily: 'monospace'
          }}>
            {formatTime(timerTime)}
          </div>

          {/* Timer Controls */}
          {!timerActive && (
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Minutes:</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', width: '80px', textAlign: 'center' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Seconds:</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', width: '80px', textAlign: 'center' }}
                />
              </div>
            </div>
          )}

          {/* Timer Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {!timerActive ? (
              <button
                onClick={startTimer}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                ▶️ Start
              </button>
            ) : (
              <button
                onClick={() => setTimerActive(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                ⏸️ Pause
              </button>
            )}
            
            <button
              onClick={resetTimer}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      {/* Stopwatch Tab */}
      {activeTab === 'stopwatch' && (
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '2rem', color: '#20205c', fontSize: '1.5rem' }}>⏱️ Stopwatch</h3>
          
          {/* Stopwatch Display */}
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: stopwatchActive ? '#10b981' : '#3b82f6',
            marginBottom: '2rem',
            fontFamily: 'monospace'
          }}>
            {formatTime(stopwatchTime)}
          </div>

          {/* Stopwatch Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setStopwatchActive(!stopwatchActive)}
              style={{
                padding: '12px 24px',
                backgroundColor: stopwatchActive ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              {stopwatchActive ? '⏸️ Stop' : '▶️ Start'}
            </button>
            
            <button
              onClick={resetStopwatch}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default StudentTimer;