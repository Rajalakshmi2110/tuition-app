import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';

const StudentTimer = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const toast = useToast();

  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerTime, setTimerTime] = useState(25 * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [laps, setLaps] = useState([]);

  // Icons
  const icons = {
    clock: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    stopwatch: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8"></circle>
        <path d="M12 9v4l2 2"></path>
        <path d="M5 3L2 6"></path>
        <path d="M22 6l-3-3"></path>
        <path d="M6.38 18.7L4 21"></path>
        <path d="M17.64 18.67L20 21"></path>
      </svg>
    ),
    play: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    ),
    pause: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    ),
    refresh: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    ),
    lightbulb: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
      </svg>
    ),
    target: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    flag: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
      </svg>
    ),
    coffee: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
        <line x1="6" y1="2" x2="6" y2="4"></line>
        <line x1="10" y1="2" x2="10" y2="4"></line>
        <line x1="14" y1="2" x2="14" y2="4"></line>
      </svg>
    ),
    brain: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
      </svg>
    ),
    droplet: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    ),
    zap: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    trophy: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
      </svg>
    )
  };

  // Preset timers with icons
  const presets = [
    { label: '5 min', minutes: 5, color: '#3b82f6' },
    { label: '15 min', minutes: 15, color: '#8b5cf6' },
    { label: '25 min', minutes: 25, color: '#10b981' },
    { label: '45 min', minutes: 45, color: '#f59e0b' },
    { label: '60 min', minutes: 60, color: '#ef4444' }
  ];

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime(time => time - 1);
      }, 1000);
    } else if (timerTime === 0 && timerActive) {
      setTimerActive(false);
      setSessionsCompleted(prev => prev + 1);
      toast.success('🎉 Timer finished! Great work!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerTime, toast]);

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

  const formatTimeDetailed = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
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
    setLaps([]);
  };

  const addLap = () => {
    setLaps(prev => [...prev, stopwatchTime]);
  };

  const setPreset = (minutes) => {
    setTimerMinutes(minutes);
    setTimerSeconds(0);
    setTimerTime(minutes * 60);
    setTimerActive(false);
  };

  const getTimerProgress = () => {
    const total = timerMinutes * 60 + timerSeconds;
    return total > 0 ? ((total - timerTime) / total) * 100 : 0;
  };

  const tabs = [
    { id: 'timer', label: 'Timer', icon: icons.clock },
    { id: 'stopwatch', label: 'Stopwatch', icon: icons.stopwatch }
  ];

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        padding: '2rem',
        borderRadius: '24px',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '20%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'white'
          }}>
            {icons.target}
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'white',
            margin: '0 0 0.5rem',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            Study Timer
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '1rem' }}>
            Track your study sessions and stay focused! ⏱️
          </p>
          
          {/* Sessions Counter */}
          {sessionsCompleted > 0 && (
            <div style={{
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <span style={{ display: 'flex' }}>{icons.trophy}</span>
              {sessionsCompleted} session{sessionsCompleted > 1 ? 's' : ''} completed today!
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        background: 'white',
        padding: '0.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ display: 'flex' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timer Tab */}
      {activeTab === 'timer' && (
        <div style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          {/* Timer Circle */}
          <div style={{
            position: 'relative',
            width: '240px',
            height: '240px',
            margin: '0 auto 2rem'
          }}>
            {/* Outer glow when active */}
            {timerActive && (
              <div style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
            )}
            
            <svg width="240" height="240" style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
              {/* Background track */}
              <circle
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="14"
              />
              {/* Progress arc */}
              <circle
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke={timerActive ? 'url(#timerGradient)' : '#cbd5e1'}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={659.73}
                strokeDashoffset={659.73 * (1 - getTimerProgress() / 100)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 2
            }}>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: timerActive ? '#10b981' : '#0f172a',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '-0.02em',
                transition: 'color 0.3s ease'
              }}>
                {formatTime(timerTime)}
              </div>
              <div style={{ 
                color: timerActive ? '#10b981' : '#64748b', 
                fontSize: '0.95rem', 
                marginTop: '0.5rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem'
              }}>
                {timerActive ? (
                  <>
                    <span style={{ display: 'flex' }}>{icons.zap}</span>
                    Focus Time
                  </>
                ) : (
                  'Ready to focus'
                )}
              </div>
            </div>
          </div>

          {/* Presets */}
          {!timerActive && (
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              {presets.map((preset) => (
                <button
                  key={preset.minutes}
                  onClick={() => setPreset(preset.minutes)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: timerMinutes === preset.minutes 
                      ? `linear-gradient(135deg, ${preset.color}, ${preset.color}dd)`
                      : '#f8fafc',
                    color: timerMinutes === preset.minutes ? 'white' : '#64748b',
                    border: `2px solid ${timerMinutes === preset.minutes ? preset.color : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    boxShadow: timerMinutes === preset.minutes ? `0 4px 15px ${preset.color}40` : 'none'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Custom Time Input */}
          {!timerActive && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f8fafc',
              borderRadius: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 700, 
                  color: '#475569', 
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={timerMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTimerMinutes(val);
                    setTimerTime(val * 60 + timerSeconds);
                  }}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    width: '90px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <span style={{ 
                fontSize: '2rem', 
                color: '#cbd5e1', 
                marginTop: '1.5rem',
                fontWeight: 700
              }}>:</span>
              <div style={{ textAlign: 'center' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 700, 
                  color: '#475569', 
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Seconds
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTimerSeconds(val);
                    setTimerTime(timerMinutes * 60 + val);
                  }}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    width: '90px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {!timerActive ? (
              <button
                onClick={startTimer}
                style={{
                  padding: '1rem 3rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
              >
                {icons.play}
                Start Focus
              </button>
            ) : (
              <button
                onClick={() => setTimerActive(false)}
                style={{
                  padding: '1rem 3rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {icons.pause}
                Pause
              </button>
            )}

            <button
              onClick={resetTimer}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '14px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              {icons.refresh}
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Stopwatch Tab */}
      {activeTab === 'stopwatch' && (
        <div style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          {/* Stopwatch Display */}
          <div style={{
            width: '240px',
            height: '240px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: stopwatchActive
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: `4px solid ${stopwatchActive ? '#10b981' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            boxShadow: stopwatchActive ? '0 0 40px rgba(16, 185, 129, 0.2)' : 'none',
            position: 'relative'
          }}>
            {/* Pulsing ring when active */}
            {stopwatchActive && (
              <div style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '2px solid #10b981',
                animation: 'pingPulse 1.5s ease-in-out infinite',
                opacity: 0.5
              }} />
            )}
            
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: stopwatchActive ? '#10b981' : '#0f172a',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '-0.02em'
            }}>
              {formatTimeDetailed(stopwatchTime)}
            </div>
            <div style={{ 
              color: stopwatchActive ? '#10b981' : '#64748b', 
              fontSize: '0.95rem', 
              marginTop: '0.5rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              {stopwatchActive ? (
                <>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    background: '#10b981', 
                    borderRadius: '50%',
                    animation: 'blink 1s ease-in-out infinite'
                  }} />
                  Running
                </>
              ) : (
                'Stopped'
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: laps.length > 0 ? '2rem' : 0 }}>
            <button
              onClick={() => setStopwatchActive(!stopwatchActive)}
              style={{
                padding: '1rem 3rem',
                background: stopwatchActive
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: stopwatchActive
                  ? '0 6px 20px rgba(239, 68, 68, 0.4)'
                  : '0 6px 20px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {stopwatchActive ? icons.pause : icons.play}
              {stopwatchActive ? 'Stop' : 'Start'}
            </button>

            {stopwatchActive && (
              <button
                onClick={addLap}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {icons.flag}
                Lap
              </button>
            )}

            <button
              onClick={resetStopwatch}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '14px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              {icons.refresh}
              Reset
            </button>
          </div>

          {/* Laps */}
          {laps.length > 0 && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '1rem',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <h4 style={{ 
                margin: '0 0 0.75rem', 
                color: '#475569', 
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {icons.flag} Lap Times
              </h4>
              {laps.map((lap, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: 'white',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Lap {index + 1}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                    {formatTimeDetailed(lap)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div style={{
        marginTop: '2rem',
        padding: '1.75rem',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: '20px',
        border: '2px solid #fcd34d'
      }}>
        <h4 style={{
          color: '#92400e',
          margin: '0 0 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '1.1rem',
          fontWeight: 700
        }}>
          <span style={{ 
            display: 'flex',
            width: '36px',
            height: '36px',
            background: 'white',
            borderRadius: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
          }}>
            {icons.lightbulb}
          </span>
          Study Tips
        </h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { icon: icons.brain, text: 'Try the Pomodoro technique: 25 min focus, 5 min break' },
            { icon: icons.coffee, text: 'Take a longer 15-30 min break after 4 sessions' },
            { icon: icons.droplet, text: 'Stay hydrated and keep snacks nearby' }
          ].map((tip, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'white',
                borderRadius: '12px',
                color: '#b45309',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              <span style={{ color: '#f59e0b', display: 'flex', flexShrink: 0 }}>{tip.icon}</span>
              {tip.text}
            </div>
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes pingPulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default StudentTimer;
