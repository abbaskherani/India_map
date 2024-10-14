import React, { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import useFetch from '../hooks/useFetch';
import { Tooltip } from 'react-tooltip';
import * as turf from '@turf/turf'
// import indiaTopoJson from '../assets/Indian_States.json'

const indiaTopoJson = 'https://raw.githubusercontent.com/india-in-data/india-states-2019/refs/heads/master/india_states.geojson';

const InteractiveIndiaMap = () => {
  const defaultCenter = [78.9629, 22.5937];
  const defaultZoom = 1
  // const {data} = useFetch(indiaTopoJson);
  const [tooltipContent, setTooltipContent] = useState('');
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [isZoomed, setIsZoomed] = useState();
  const [stateGeoJSON, setStateGeoJSON] = useState(false);
  
  
  
  
  // const [tooltipContent, setTooltipContent] = useState('')
  const [position, setPosition] = useState({ coordinates: [78.9629, 22.5937], zoom: 1 })

  const handleStateClick = useCallback((geo) => {
    const centroid = geo.geometry.coordinates[0][0][40]
    setPosition(prev => ({
      ...prev,
      coordinates: centroid,
      zoom: prev.zoom === 1 ? 3 : 1
    }))
  }, [])

//   console.log("the data is ", data.objects["india-districts-2019-734"].geometries[0].properties.st_nm);
//   console.log(stateGeoJSON);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: center,
          }}
        > <ZoomableGroup
        zoom={position.zoom}
        center={position.coordinates}
        onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
      >
          
          <Geographies geography={indiaTopoJson}>
            {({ geographies }) => {
              // console.log("geographies ",geographies);
              // console.log("data   ",data);
            //   console.log(stateGeoJSON);
              return geographies.map((geo,i) => 
                {
                   console.log(geo);
                  return  (
                    
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipContent(`${geo.properties.ST_NM}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                  onClick={() => handleStateClick(geo)}
                  data-tooltip-id = "state-tooltip"
                  style={{
                    default: {
                      fill: '#D6D6DA',
      outline: 'none',
      stroke: '#FFFFFF',
      strokeWidth: 0.5,
    },
    hover: {
      fill: '#F53',
      outline: 'none',
      stroke: '#FFFFFF',
      strokeWidth: 0.5,
    },
    pressed: {
      fill: '#E42',
      outline: 'none',
      stroke: '#FFFFFF',
      strokeWidth: 0.5,
    }
                  }}
                />
              )});
            }}
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="state-tooltip">{tooltipContent}</Tooltip>
      </div>
    </div>
  );
};

export default InteractiveIndiaMap;
