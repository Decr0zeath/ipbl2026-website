// ============================================================
// Interactive venue map (event.html only). Leaflet over CARTO's
// "Positron no-labels" basemap, which ships with zero baked-in
// text — the campuses/mapLabels arrays below hand-place the only
// labels that matter instead of fighting raster-tile label
// clutter at a "far" zoom.
// No-ops if #venueMap or the Leaflet global isn't present, so
// this file is safe to include on any page.
// ============================================================

(function () {
  var mount = document.getElementById('venueMap');
  if (!mount || typeof L === 'undefined') return;

  // Coordinates: USJ-R Main Campus is a surveyed OpenStreetMap point.
  // The Quadricentennial Campus is too new for OSM/Nominatim to have
  // an entry yet, so its coordinate is a best-effort placement along
  // Colon Street and should be checked against the real building.
  var campuses = [
    { id: 'quad', name: 'USJ-R Quadricentennial Campus', role: 'iPBL 2026 Venue', lat: 10.2964, lng: 123.8985, primary: true },
    { id: 'main', name: 'USJ-R Main Campus', role: 'Magallanes Street', lat: 10.29403, lng: 123.89749, primary: false }
  ];

  var mapLabels = [
    { text: 'Colon Street', lat: 10.2963, lng: 123.8993, kind: 'street' },
    { text: 'Magallanes Street', lat: 10.2937, lng: 123.8968, kind: 'street' },
    { text: 'Sanciangko Street', lat: 10.2991, lng: 123.9008, kind: 'street' },
    { text: 'Carbon Market', lat: 10.2920, lng: 123.8978, kind: 'district' },
    { text: 'Ermita', lat: 10.2953, lng: 123.8975, kind: 'district' }
  ];

  var map = L.map(mount, { scrollWheelZoom: false }).setView([campuses[0].lat, campuses[0].lng], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
  }).addTo(map);

  // Marker tooltips and plain-text street/district labels both live in
  // Leaflet's shared tooltipPane, which stacks above markerPane — so a
  // label placed near a pin (e.g. the venue sits ON Colon Street) can
  // paint its halo straight over the pin icon. A dedicated pane above
  // tooltipPane keeps pins on top regardless of label placement.
  var pinPane = map.createPane('pinPane');
  pinPane.style.zIndex = 660;

  var PIN_GAP = 8; // desired px gap between a pin's edge and its label, equalised below

  function pinIcon(kind, scale) {
    var w = Math.round(30 * scale), h = Math.round(30 * scale);
    var svg = '<svg viewBox="0 0 24 24" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="currentColor" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>';
    return L.divIcon({ className: 'map-pin map-pin--' + kind, html: svg, iconSize: [w, h], iconAnchor: [w / 2, h] });
  }

  var boundsPts = [];

  campuses.forEach(function (c) {
    var kind = c.primary ? 'primary' : 'secondary';
    var icon = pinIcon(kind, c.primary ? 1 : 0.82);
    var halfWidth = icon.options.iconSize[0] / 2;
    var tipToMiddle = Math.round(icon.options.iconSize[1] * 0.55);

    L.marker([c.lat, c.lng], { icon: icon, keyboard: false, pane: 'pinPane' }).addTo(map).bindTooltip(
      '<span class="map-tooltip-name">' + c.name + '</span><span class="map-tooltip-role">' + c.role + '</span>',
      {
        permanent: true,
        direction: c.primary ? 'left' : 'right',
        // offset.x carries each pin's own half-width so the visible gap
        // from pin edge to label reads the same on both sides even though
        // the primary pin renders larger than the secondary one.
        offset: [halfWidth + PIN_GAP, -tipToMiddle],
        className: 'map-tooltip map-tooltip--' + kind
      }
    );
    boundsPts.push([c.lat, c.lng]);
  });

  mapLabels.forEach(function (l) {
    L.marker([l.lat, l.lng], { icon: L.divIcon({ className: '', iconSize: [0, 0] }), interactive: false, keyboard: false })
      .addTo(map)
      .bindTooltip(l.text, { permanent: true, direction: 'center', className: 'map-label-tooltip map-label-tooltip--' + l.kind });
    boundsPts.push([l.lat, l.lng]);
  });

  map.fitBounds(L.latLngBounds(boundsPts), { padding: [50, 50], maxZoom: 17 });

  // Container is sized by CSS/flex layout, so Leaflet needs a nudge to
  // remeasure once that layout settles, or tiles render into stale bounds.
  setTimeout(function () { map.invalidateSize(); }, 0);

  // ---- Collapsed attribution: small "i" circle, full credit on hover/tap ----
  var attr = mount.querySelector('.leaflet-control-attribution');
  if (attr) {
    var creditHtml = attr.innerHTML;
    attr.innerHTML =
      '<span class="venue-map-attr-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
      '<rect x="7.15" y="6.6" width="1.7" height="5.4" fill="currentColor"/>' +
      '<rect x="7.15" y="3.6" width="1.7" height="1.7" fill="currentColor"/>' +
      '</svg></span>' +
      '<span class="venue-map-attr-text">' + creditHtml + '</span>';
    attr.classList.add('venue-map-attr');
    attr.setAttribute('tabindex', '0');
    attr.addEventListener('click', function (e) {
      e.stopPropagation();
      attr.classList.toggle('isOpen');
    });
    document.addEventListener('click', function (e) {
      if (!attr.contains(e.target)) attr.classList.remove('isOpen');
    });
  }
})();
