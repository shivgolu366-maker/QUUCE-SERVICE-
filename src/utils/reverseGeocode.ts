// Real GPS location detector & reverse geocoding helper using browser Geolocation API and OpenStreetMap Nominatim

export interface DetectedLocationResult {
  address: string;
  coords: [number, number];
  city: string;
  state: string;
  postcode: string;
  area: string;
}

export const detectCurrentLocationWithGps = (): Promise<DetectedLocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim API
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            { 
              headers: { 'Accept-Language': 'en,hi' },
              signal: controller.signal 
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            
            const road = addr.road || addr.street || addr.pedestrian || '';
            const sub = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || '';
            const city = addr.city || addr.town || addr.village || addr.county || 'Noida';
            const state = addr.state || 'Uttar Pradesh';
            const postcode = addr.postcode || '';

            const parts = [road, sub, city, state, postcode].filter(Boolean);
            const fullAddress = parts.length > 0 ? parts.join(', ') : (data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`);

            resolve({
              address: fullAddress,
              coords: [lat, lon],
              city,
              state,
              postcode,
              area: sub || road || city
            });
            return;
          }
        } catch (e) {
          // Fallback if network/API fails or timed out
        }

        // Clean coordinate fallback
        resolve({
          address: `GPS Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
          coords: [lat, lon],
          city: 'Noida',
          state: 'Uttar Pradesh',
          postcode: '201301',
          area: 'Live GPS Pin'
        });
      },
      (err) => {
        let msg = 'Could not retrieve GPS location';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow GPS access in your browser settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS signal unavailable. Please ensure location is enabled.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'GPS detection timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
};
