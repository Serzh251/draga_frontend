// src/components/Map/Instruments/DrawTools.jsx
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

import '../../../utils/leafletDrawRu';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Modal, Form, Input, message, ColorPicker, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import { useCreateUserGeoDataMutation } from '../../../api/api';
import VirtualKeyboard from '../../tolls/VirtualKeyboard';
import { shouldUseVirtualKeyboard } from '../../../utils/getTypePlarform';
import SaveMapCenterButton from '../../buttons/SaveMapCenterButton';

// Исправляем иконку маркера
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DrawTools = ({ map, isAuth }) => {
  const [showModal, setShowModal] = useState(false);
  const [drawnItems, setDrawnItems] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [createUserGeoData, { isLoading }] = useCreateUserGeoDataMutation();

  const [activeField, setActiveField] = useState(null);
  const showVirtualKeyboard = shouldUseVirtualKeyboard();

  // Создаём форму
  const [form] = Form.useForm();

  useEffect(() => {
    if (!map) return;

    // Проверяем, уже ли добавлен контрол
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

    map.addControl(drawControl);
    map.drawControl = drawControl;

    const updateMeasurements = (layer) => {
      let tooltipContent = '';

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        tooltipContent = `Площадь: ${area.toFixed(2)} м²`;
      } else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        const latLngs = layer.getLatLngs();
        const length = latLngs.reduce((sum, latLng, index, array) => {
          if (index === 0) return sum;
          const prevLatLng = array[index - 1];
          return sum + map.distance(prevLatLng, latLng);
        }, 0);
        tooltipContent = `Длина: ${length.toFixed(2)} м`;
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

    map.on(L.Draw.Event.CREATED, (event) => {
      const { layerType, layer } = event;

      items.eachLayer((l) => {
        if (
          (layerType === 'marker' && l instanceof L.Marker) ||
          (layerType === 'polyline' && l instanceof L.Polyline && !(l instanceof L.Polygon)) ||
          (layerType === 'polygon' && l instanceof L.Polygon && !(l instanceof L.Rectangle))
        ) {
          items.removeLayer(l);
        }
      });

      items.addLayer(layer);
      updateMeasurements(layer);
    });

    map.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer((layer) => {
        updateMeasurements(layer);
      });
    });

    // Очистка
    return () => {
      if (map.drawControl) {
        map.removeControl(map.drawControl);
        delete map.drawControl;
      }
      if (items) {
        items.clearLayers();
      }
    };
  }, [map]);

  const handleFocus = (field) => {
    if (showVirtualKeyboard) {
      setActiveField(field);
    }
  };

  const handleKeyPress = (key) => {
    if (!activeField) return;

    const currentValue = form.getFieldValue(activeField) || '';
    let newValue = currentValue;

    if (key === 'Backspace') {
      newValue = newValue.slice(0, -1);
    } else if (key === 'Space') {
      newValue += ' ';
    } else {
      newValue += key;
    }

    form.setFieldsValue({ [activeField]: newValue });
  };

  const saveGeoData = async () => {
    try {
      const formData = await form.validateFields();

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
      setActiveField(null);
      if (drawnItems) {
        drawnItems.clearLayers();
      }
    } catch (error) {
      messageApi.error(`❌ Ошибка при сохранении: ${error.data?.detail || 'Неизвестная ошибка'}`);
    }
  };

  const handleKeyboardClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {contextHolder}
      {isAuth && (
        <Tooltip title="Сохранить данные" placement="right">
          <SaveOutlined
            onClick={() => setShowModal(true)}
            style={{
              position: 'absolute',
              top: '230px',
              left: '10px',
              background: 'white',
              padding: '3px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              fontSize: '25px',
              // color: '#007bff',
              cursor: 'pointer',
              zIndex: 1000,
            }}
          />
        </Tooltip>
      )}

      <Modal
        title="Сохранение геоданных"
        open={showModal}
        onOk={saveGeoData}
        onCancel={() => {
          setShowModal(false);
          setActiveField(null);
          form.resetFields();
        }}
        okText="Сохранить геоданные"
        cancelText="Отмена"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" initialValues={{ color: '#0015ff' }}>
          <Form.Item
            name="name"
            label="Название:"
            rules={[{ required: true, message: 'Поле "Название" обязательно!' }]}
          >
            <Input placeholder="Введите название" onFocus={() => handleFocus('name')} />
          </Form.Item>

          <Form.Item name="description" label="Описание:">
            <Input.TextArea placeholder="Введите описание" onFocus={() => handleFocus('description')} />
          </Form.Item>

          <Form.Item label="Выберите цвет:" name="color" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-block' }}>
              <ColorPicker
                onChange={(color) => form.setFieldsValue({ color: color.toHexString() })}
                style={{ height: '40px', marginTop: '5px' }}
              />
            </div>
          </Form.Item>
        </Form>
        <SaveMapCenterButton map={map} onSaveSuccess={() => setShowModal(false)} />
      </Modal>

      {showVirtualKeyboard && activeField && (
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onClose={() => setActiveField(null)}
          onClick={handleKeyboardClick}
        />
      )}
    </>
  );
};

export default DrawTools;
