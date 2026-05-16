const DELHI_COORDS = {
  "Rohini, Delhi": [28.7041, 77.1025],
  "Pitampura, Delhi": [28.6990, 77.1384],
  "Laxmi Nagar, Delhi": [28.6304, 77.2774],
  "Saket, Delhi": [28.5245, 77.2066],
  "Dwarka, Delhi": [28.5921, 77.0460],
  "Tilak Nagar, Delhi": [28.6365, 77.0967],
  "Janakpuri, Delhi": [28.6219, 77.0878],
  "SDA, Delhi": [28.5478, 77.2001],
  "Vasant Kunj, Delhi": [28.5200, 77.1587],
  "Karkardooma, Delhi": [28.6487, 77.3057],
  "Okhla, Delhi": [28.5355, 77.2868],
  "Sarita Vihar, Delhi": [28.5286, 77.2883],
  "South Extension, Delhi": [28.5687, 77.2209],
  "Vikas Puri, Delhi": [28.6388, 77.0704],
  "Green Park, Delhi": [28.5582, 77.2028],
  "Defence Colony, Delhi": [28.5718, 77.2320],
  "Preet Vihar, Delhi": [28.6415, 77.2951],
  "Punjabi Bagh, Delhi": [28.6689, 77.1325],
  "Connaught Place, Delhi": [28.6315, 77.2167],
  "Greater Kailash, Delhi": [28.5484, 77.2428],
  "Shalimar Bagh, Delhi": [28.7164, 77.1563],
  "Patparganj, Delhi": [28.6173, 77.2931],
};

function validCoordinate(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

function haversineSql(latParam = '$1', lngParam = '$2') {
  return `
    6371 * acos(
      least(1, greatest(-1,
        cos(radians(${latParam})) * cos(radians(lb.latitude)) *
        cos(radians(lb.longitude) - radians(${lngParam})) +
        sin(radians(${latParam})) * sin(radians(lb.latitude))
      ))
    )
  `;
}

module.exports = { DELHI_COORDS, validCoordinate, haversineSql };
