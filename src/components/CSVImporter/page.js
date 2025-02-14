"use client"

import React, { useState } from 'react';

const CSVImporter = () => {
  const [csvData, setCSVData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mappings, setMappings] = useState({});
  const [error, setError] = useState('');

  const requiredFields = ['Name', 'Email', 'Age'];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      const data = lines.slice(1).map(line => line.split(','));

      setHeaders(headers);
      setCSVData(data);
      setMappings({});
      setError('');
    };

    reader.readAsText(file);
  };

  const handleMapping = (field, header) => {
    setMappings(prev => ({ ...prev, [field]: header }));
  };

  const validateMappings = () => {
    const missingFields = requiredFields.filter(field => !mappings[field]);
    if (missingFields.length > 0) {
      setError(`Please map the following required fields: ${missingFields.join(', ')}`);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateMappings()) {
      console.log('Mappings:', mappings);
      console.log('CSV Data:', csvData);
      // Here you would typically send the data to your backend or process it further
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '32rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>CSV Importer</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload" style={{ cursor: 'pointer', display: 'block', padding: '2rem', border: '2px dashed #ccc', borderRadius: '0.5rem', textAlign: 'center' }}>
          <div>
            <span style={{ display: 'block', marginBottom: '0.5rem' }}>📁</span>
            <span style={{ fontWeight: 'semibold' }}>
              Upload CSV file
            </span>
          </div>
        </label>
      </div>

      {headers.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '0.5rem' }}>Map Fields</h2>
          {requiredFields.map(field => (
            <div key={field} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'medium' }}>{field}:</label>
              <select 
                onChange={(e) => handleMapping(field, e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
              >
                <option value="">Select a column</option>
                {headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #F87171', borderRadius: '0.25rem', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ color: '#B91C1C', fontWeight: 'bold' }}>Error</p>
          <p style={{ color: '#B91C1C' }}>{error}</p>
        </div>
      )}

      <button 
        onClick={handleSubmit} 
        disabled={headers.length === 0}
        style={{ 
          backgroundColor: headers.length === 0 ? '#D1D5DB' : '#3B82F6', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem', 
          border: 'none', 
          cursor: headers.length === 0 ? 'not-allowed' : 'pointer' 
        }}
      >
        Import Data
      </button>
    </div>
  );
};

export default CSVImporter;