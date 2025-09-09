import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PerformancePrediction = () => {
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const decoded = jwtDecode(token);
      const response = await axios.get(`http://localhost:5000/api/ml/predict/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.predictions) {
        setPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    const icons = {
      improving: '📈',
      declining: '📉',
      stable: '➡️'
    };
    return icons[trend] || '📊';
  };

  const getTrendColor = (trend) => {
    const colors = {
      improving: '#10b981',
      declining: '#ef4444',
      stable: '#f59e0b'
    };
    return colors[trend] || '#6b7280';
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444'
    };
    return colors[risk] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Analyzing your performance...</div>
      </div>
    );
  }

  if (Object.keys(predictions).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ color: '#20205c', marginBottom: '1rem' }}>No Performance Data</h3>
        <p style={{ color: '#666' }}>Complete some assignments to see your performance predictions!</p>
      </div>
    );
  }

  const subjects = Object.keys(predictions);
  const currentPrediction = selectedSubject === 'all' ? 
    Object.values(predictions)[0] : predictions[selectedSubject];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        🤖 AI Performance Prediction
      </h2>

      {/* Subject Selector */}
      {subjects.length > 1 && (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '2px solid #3b82f6',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      )}

      {/* Prediction Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Next Score Prediction */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>
            {currentPrediction?.nextAssignmentScore || 'N/A'}%
          </h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Predicted Next Score</p>
          <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
            Confidence: {Math.round((currentPrediction?.confidence || 0) * 100)}%
          </div>
        </div>

        {/* Performance Trend */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {getTrendIcon(currentPrediction?.trend)}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getTrendColor(currentPrediction?.trend), margin: '0', textTransform: 'capitalize' }}>
            {currentPrediction?.trend || 'Unknown'}
          </h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Performance Trend</p>
        </div>

        {/* Risk Level */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getRiskColor(currentPrediction?.riskLevel), margin: '0', textTransform: 'capitalize' }}>
            {currentPrediction?.riskLevel || 'Unknown'} Risk
          </h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Performance Risk</p>
        </div>

        {/* Average Score */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>
            {currentPrediction?.historicalData?.overallAverage || 'N/A'}%
          </h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Current Average</p>
          <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
            {currentPrediction?.historicalData?.totalBadges || 0} badges
          </div>
        </div>

        {/* Achievement Score */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0' }}>
            {currentPrediction?.historicalData?.achievementScore || 0}
          </h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Achievement Score</p>
        </div>

        {/* Motivation Level */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0' }}>
            {currentPrediction?.motivationLevel || 'Unknown'}
          </h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Motivation Level</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ color: '#20205c', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🤖 AI Recommendations
        </h3>
        
        {currentPrediction?.recommendations?.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {currentPrediction.recommendations.map((recommendation, index) => (
              <div key={index} style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '6px'
              }}>
                {recommendation}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No specific recommendations available yet.</p>
        )}
      </div>

      {/* Performance History Chart */}
      {currentPrediction?.historicalData?.recentScores && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#20205c', marginBottom: '1.5rem' }}>📈 Recent Performance</h3>
          
          <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', height: '200px', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            {currentPrediction.historicalData.recentScores.map((score, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  height: `${(score / 100) * 150}px`,
                  backgroundColor: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
                  width: '100%',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '10px',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  paddingBottom: '0.25rem'
                }}>
                  {score}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
                  A{index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <strong>Improvement Rate:</strong> {currentPrediction.historicalData.improvementRate > 0 ? '+' : ''}{Math.round(currentPrediction.historicalData.improvementRate * 100) / 100} points per assignment
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePrediction;