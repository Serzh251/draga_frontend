import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Modal, Form, Input, message, ColorPicker } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { useCreateUserGeoDataMutation } from '../../../api/api';

// Исправляем иконку маркера
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DrawTools = () => {
  const map = useMap();
  const [showModal, setShowModal] = useState(false);
  const [drawnItems, setDrawnItems] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [createUserGeoData, { isLoading }] = useCreateUserGeoDataMutation();

  useEffect(() => {
    if (map.drawControl) return;

    const items = new L.FeatureGroup();
    map.addLayer(items);
    setDrawnItems(items);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      edit: { featureGroup: items, remove: true },
      draw: {
        polygon: true,
        polyline: true,
        marker: true,
        rectangle: false,
        circle: false,
        circlemarker: false,
      },
    });
    const updateMeasurements = (layer) => {
      let tooltipContent = '';

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        tooltipContent = `Площадь: ${area.toFixed(2)} м²`;
      } else if (layer instanceof L.Polyline) {
        const latLngs = layer.getLatLngs();
        const length = latLngs.reduce((sum, latLng, index, array) => {
          if (index === 0) return sum;
          const prevLatLng = array[index - 1];
          return sum + map.distance(prevLatLng, latLng);
        }, 0);
        tooltipContent = `Длина: ${length.toFixed(2)} м`;
      } else if (layer instanceof L.Circle) {
        const radius = layer.getRadius();
        if (!isNaN(radius)) {
          const circleArea = Math.PI * radius * radius;
          tooltipContent = `Радиус: ${radius.toFixed(2)} м, Площадь: ${circleArea.toFixed(2)} м²`;
        } else {
          console.error('Invalid radius value:', radius);
          tooltipContent = 'Ошибка в расчете радиуса.';
        }
      }

      if (tooltipContent) {
        layer
          .bindTooltip(tooltipContent, {
            permanent: true,
            direction: 'center',
            className: 'leaflet-tooltip-area',
          })
          .openTooltip();
      }
    };

    map.addControl(drawControl);
    map.drawControl = drawControl;

    map.on(L.Draw.Event.CREATED, (event) => {
      const { layerType, layer } = event;
      if (layerType === 'marker') {
        items.eachLayer((l) => {
          if (l instanceof L.Marker) items.removeLayer(l);
        });
      } else if (layerType === 'polyline') {
        items.eachLayer((l) => {
          if (l instanceof L.Polyline && !(l instanceof L.Polygon)) items.removeLayer(l);
        });
      } else if (layerType === 'polygon') {
        items.eachLayer((l) => {
          if (l instanceof L.Polygon && !(l instanceof L.Rectangle)) items.removeLayer(l);
        });
      }
      items.addLayer(layer);
      updateMeasurements(layer);
    });
    map.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer((layer) => {
        updateMeasurements(layer);
      });
    });
  }, [map]);

  const [form] = Form.useForm();

  const saveGeoData = async () => {
    try {
      await form.validateFields();

      if (!drawnItems || !drawnItems.getLayers().length) {
        messageApi.error('Вы должны нарисовать хотя бы один объект, чтобы сохранить!');
        return;
      }

      const geojsonData = drawnItems.toGeoJSON();
      const geoFields = { point: null, line: null, polygon: null };

      geojsonData.features.forEach((feature) => {
        if (feature.geometry.type === 'Point') {
          geoFields.point = feature.geometry;
        } else if (feature.geometry.type === 'LineString') {
          geoFields.line = feature.geometry;
        } else if (feature.geometry.type === 'Polygon') {
          geoFields.polygon = feature.geometry;
        }
      });

      const formData = form.getFieldsValue();
      const payload = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        ...geoFields,
      };

      await createUserGeoData(payload).unwrap();
      messageApi.success('✅ Данные успешно сохранены!');
      form.resetFields();
      setShowModal(false);
      if (drawnItems) {
        drawnItems.clearLayers();
      }
    } catch (error) {
      messageApi.error(`❌ Ошибка при сохранении: ${error.data?.detail || 'Неизвестная ошибка'}`);
    }
  };

  return (
    <>
      {contextHolder}
      <SaveOutlined
        onClick={() => setShowModal(true)}
        style={{
          position: 'absolute',
          top: '200px',
          left: '10px',
          fontSize: '24px',
          color: '#007bff',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      />

      <Modal
        title="Сохранение геоданных"
        open={showModal}
        onOk={saveGeoData}
        onCancel={() => setShowModal(false)}
        okText="Сохранить"
        cancelText="Отмена"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название:"
            rules={[{ required: true, message: 'Поле "Название" обязательно!' }]}
          >
            <Input placeholder="Введите название" />
          </Form.Item>

          <Form.Item name="description" label="Описание:">
            <Input.TextArea placeholder="Введите описание" />
          </Form.Item>

          <Form.Item label="Выберите цвет:" name="color" initialValue="#0015ff" style={{ justifyContent: 'center' }}>
            <ColorPicker
              value={form.getFieldValue('color')}
              onChange={(color) => form.setFieldsValue({ color: color.toHexString() })}
              style={{ width: '20%', height: '40px', marginTop: '5px', display: 'flex', alignItems: 'center' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DrawTools;
