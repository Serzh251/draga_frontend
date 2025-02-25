const config = {
  API_URL: "http://localhost:2025",
  API_ADMIN: "http://localhost/admin/",
  WS_API_HOST: "ws://localhost:8055/ws",
  timeZone: "Europe/Moscow",
  defaultPosition: [
    [64.5624, 40.488],
    [64.559, 40.482],
  ],
  layers: [
    {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    {
      name: 'Google Satellite',
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps'
    },
    {
      name: 'CartoDB Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB'
    },
    {
      name: 'ArcGIS Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri'
    },
    {
      name: 'HOT',
      url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
      attribution: '&copy; Humanitarian OpenStreetMap Team'
    },
    {
      name: 'OpenTopoMap',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap contributors'
    },
    {
      name: 'Cycle Map',
      url: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap France'
    }
  ],
};

export default config;