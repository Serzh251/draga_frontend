import React from 'react';
import { ZoomControl, ScaleControl } from 'react-leaflet';
import LayersControlComponent from './LayersControlComponent';
import DrawTools from './DrawTools';
import RulerControl from './RulerControl';

const MapInstruments = () => {
  return (
    <>
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      <LayersControlComponent />
      <DrawTools />
      <RulerControl />
    </>
  );
};

export default MapInstruments;
