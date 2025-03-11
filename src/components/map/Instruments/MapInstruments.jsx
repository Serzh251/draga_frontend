import React from 'react';
import { ZoomControl, ScaleControl } from 'react-leaflet';
import LayersControlComponent from './LayersControlComponent';
import DrawTools from './DrawTools';
import MeasureControl from './MeasureControl';

const MapInstruments = () => {
  return (
    <>
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      <LayersControlComponent />
      <MeasureControl />
      <DrawTools />
    </>
  );
};

export default MapInstruments;
