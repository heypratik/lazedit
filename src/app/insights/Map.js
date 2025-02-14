"use client"

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/features.json";

// const data = [
//   { "country": "Australia", "value": 0.1 },
//   { "country": "Austria", "value": 0 },
//   { "country": "Bangladesh", "value": 0 },
//   { "country": "Belgium", "value": 0 },
//   { "country": "Bulgaria", "value": 0 },
//   { "country": "Canada", "value": 0.4 },
//   { "country": "China", "value": 0 },
//   { "country": "Croatia", "value": 0 },
//   { "country": "Cyprus", "value": 0 },
//   { "country": "Czech Republic", "value": 0 },
//   { "country": "Denmark", "value": 0 },
//   { "country": "Finland", "value": 0 },
//   { "country": "France", "value": 0 },
//   { "country": "Germany", "value": 0 },
//   { "country": "Greece", "value": 0 },
//   { "country": "Hungary", "value": 0 },
//   { "country": "India", "value": 0 },
//   { "country": "Ireland", "value": 0 },
//   { "country": "Italy", "value": 0 },
//   { "country": "Japan", "value": 0 },
//   { "country": "Latvia", "value": 0 },
//   { "country": "Malta", "value": 0 },
//   { "country": "Mexico", "value": 0 },
//   { "country": "Netherlands", "value": 0 },
//   { "country": "New Zealand", "value": 0 },
//   { "country": "Philippines", "value": 0 },
//   { "country": "Poland", "value": 0 },
//   { "country": "Portugal", "value": 0 },
//   { "country": "Romania", "value": 0 },
//   { "country": "Singapore", "value": 0 },
//   { "country": "Slovakia", "value": 0 },
//   { "country": "Slovenia", "value": 0 },
//   { "country": "Spain", "value": 0 },
//   { "country": "Sri Lanka", "value": 0 },
//   { "country": "Sweden", "value": 0 },
//   { "country": "United Kingdom", "value": 0.1 },
//   { "country": "United States", "value": 99 }
// ];

export default function Map({data}) {
  const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 });

  const getColor = (countryName) => {
    const countryData = data.find((d) => d.country === countryName);
    if (!countryData || countryData.value === 0) return "#FFF";
    
    const value = countryData.value;
    const baseR = 0xf2;
    const baseG = 0x32;
    const baseB = 0x50;
    
    const bracket = Math.ceil(value / 10);
    const lightnessFactor = (10 - bracket) / 10;
    
    const r = Math.round(baseR + (255 - baseR) * lightnessFactor);
    const g = Math.round(baseG + (255 - baseG) * lightnessFactor);
    const b = Math.round(baseB + (255 - baseB) * lightnessFactor);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="relative w-full bg-gray-100 p-4">
      <h2 className="font-bold text-xl mb-4">Customers By Region (%)</h2>
                  
         <div
          className="text-sm p-2 text-white bg-gray-800 rounded pointer-events-none"
        >
          {tooltip.show ? tooltip.content : "Hover Over A Country To See Customer Percentage"}
        </div>
      
      <ComposableMap
        projectionConfig={{
          projection: "geoMercator",
        }}
        onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const countryData = data.find(d => d.country === countryName);
              const hasCustomers = countryData && countryData.value > 0;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(countryName)}
                  stroke="#DDD"
                  strokeWidth={0.4}
                  onMouseEnter={(evt) => {
                    const value = countryData ? countryData.value : 0;
                    setTooltip({
                      show: true,
                      content: `${countryName}: ${value}%`,
                      x: evt.clientX,
                      y: evt.clientY
                    });
                  }}
                  onMouseMove={(evt) => {
                    setTooltip(prev => ({
                      ...prev,
                      x: evt.clientX,
                      y: evt.clientY
                    }));
                  }}
                  onMouseLeave={() => {
                    setTooltip(prev => ({ ...prev, show: false }));
                  }}
                  style={{
                    default: {
                      outline: "none"
                    },
                    hover: {
                      fill: hasCustomers ? "#f23250" : "#F5F5F5",
                      outline: "none"
                    },
                    pressed: {
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

