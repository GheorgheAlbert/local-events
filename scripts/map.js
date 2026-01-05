window.MAP = (function () {
  let map = null;
  let markersLayer = null;
  let openDetails = null;

  let markersById = {};
  let userMarker = null;

 // blue pin - events
  const eventIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  //red pin - user
  const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  function init(events, openDetailsFn) {
    openDetails = openDetailsFn;

    map = L.map("map").setView([44.4268, 26.1025], 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    // user position
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        map.setView([lat, lng], 13);

        if (userMarker) userMarker.remove();

        userMarker = L.marker([lat, lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<strong>You are here</strong>");
      },
      function () { }
    );

    setMarkers(events);
  }

  function setMarkers(events) {
    if (!markersLayer) return;

    markersLayer.clearLayers();
    markersById = {};

    events.forEach(ev => {
      const marker = L.marker([ev.lat, ev.lng], { icon: eventIcon }).addTo(markersLayer);

      marker.bindPopup(`<strong>${ev.title}</strong><br><small>${ev.city}</small>`);

      marker.on("click", function () {
        if (openDetails) openDetails(ev.id);
      });

      markersById[ev.id] = marker;
    });
  }

  function focusEvent(id) {
    const marker = markersById[id];
    if (!marker || !map) return;

    const latlng = marker.getLatLng();
    map.setView(latlng, 15, { animate: true });
    marker.openPopup();
  }

  return { init, setMarkers, focusEvent };
})();
