import React from 'react';
import { Marker, Polyline, Polygon, Popup } from 'react-leaflet';
import { useUserGeoData } from '../../../hook/userGeoData';
import PopupContent from './PopupComponent';

const UserGeoDataLayer = () => {
  const { userGeoData } = useUserGeoData();

  return (
    <>
      {Array.isArray(userGeoData) &&
        userGeoData.map((feature) => {
          const { geometry, properties } = feature;

          if (!geometry) {
            return null;
          }

          const color = properties?.color || '#3388ff';
          if (geometry.type === 'Point') {
            return (
              <Marker key={feature.id} position={[geometry.coordinates[1], geometry.coordinates[0]]}>
                <Popup>
                  <PopupContent name={properties.name} description={properties.description} />
                </Popup>
              </Marker>
            );
          }

          if (geometry.type === 'LineString') {
            return (
              <Polyline
                key={feature.id}
                positions={geometry.coordinates.map((coord) => [coord[1], coord[0]])}
                pathOptions={{ color }}
              >
                <Popup>
                  <PopupContent name={properties.name} description={properties.description} />
                </Popup>
              </Polyline>
            );
          }

          if (geometry.type === 'Polygon') {
            return (
              <Polygon
                key={feature.id}
                positions={geometry.coordinates.map((ring) => ring.map((coord) => [coord[1], coord[0]]))}
                pathOptions={{ color }}
              >
                <Popup>
                  <PopupContent name={properties.name} description={properties.description} />
                </Popup>
              </Polygon>
            );
          }

          if (geometry.type === 'GeometryCollection') {
            return geometry.geometries.map((geo, index) => {
              if (geo.type === 'Point') {
                return (
                  <Marker key={`${feature.id}-geo-${index}`} position={[geo.coordinates[1], geo.coordinates[0]]}>
                    <Popup>
                      <PopupContent name={properties.name} description={properties.description} />
                    </Popup>
                  </Marker>
                );
              }

              if (geo.type === 'LineString') {
                return (
                  <Polyline
                    key={`${feature.id}-geo-${index}`}
                    positions={geo.coordinates.map((coord) => [coord[1], coord[0]])}
                    pathOptions={{ color }}
                  >
                    <Popup>
                      <PopupContent name={properties.name} description={properties.description} />
                    </Popup>
                  </Polyline>
                );
              }

              if (geo.type === 'Polygon') {
                return (
                  <Polygon
                    key={`${feature.id}-geo-${index}`}
                    positions={geo.coordinates.map((ring) => ring.map((coord) => [coord[1], coord[0]]))}
                    pathOptions={{ color }}
                  >
                    <Popup>
                      <PopupContent name={properties.name} description={properties.description} />
                    </Popup>
                  </Polygon>
                );
              }

              return null;
            });
          }

          return null;
        })}
    </>
  );
};

export default UserGeoDataLayer;
