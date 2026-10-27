/**
 * Pure business logic for Haversine distance and geofence verification.
 * Follows Earth mean radius of 6,371,000 meters.
 */

export const EARTH_RADIUS_METERS = 6371000;

/**
 * Validates whether given latitude and longitude coordinates are within valid geographic bounds.
 * Latitude must be in [-90, 90], Longitude must be in [-180, 180].
 *
 * @param {number} lat - Latitude in degrees
 * @param {number} lng - Longitude in degrees
 * @returns {boolean} True if coordinates are valid finite numbers within bounds
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 *
 * @param {number} lat1 - Starting latitude in degrees
 * @param {number} lon1 - Starting longitude in degrees
 * @param {number} lat2 - Destination latitude in degrees
 * @param {number} lon2 - Destination longitude in degrees
 * @returns {number} Distance in meters rounded to 2 decimal places, or NaN if coordinates are invalid
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    return NaN;
  }

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const radLat1 = degreesToRadians(lat1);
  const radLat2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_METERS * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Checks whether a worker's coordinates fall within the site's geofence radius.
 *
 * @param {{ latitude: number; longitude: number }} workerCoords - Worker coordinates
 * @param {{ latitude: number; longitude: number }} siteCoords - Site location coordinates
 * @param {number} radiusMeters - Geofence radius in meters
 * @returns {{ isInside: boolean; distanceMeters: number; isValid: boolean; error?: string }} Geofence check result
 */
export function checkGeofence(
  workerCoords: { latitude: number; longitude: number },
  siteCoords: { latitude: number; longitude: number },
  radiusMeters: number
): { isInside: boolean; distanceMeters: number; isValid: boolean; error?: string } {
  if (!workerCoords || !siteCoords) {
    return { isInside: false, distanceMeters: 0, isValid: false, error: 'Missing coordinates' };
  }

  if (
    !isValidCoordinate(workerCoords.latitude, workerCoords.longitude) ||
    !isValidCoordinate(siteCoords.latitude, siteCoords.longitude)
  ) {
    return { isInside: false, distanceMeters: 0, isValid: false, error: 'Invalid coordinate values' };
  }

  if (typeof radiusMeters !== 'number' || radiusMeters <= 0 || !Number.isFinite(radiusMeters)) {
    return { isInside: false, distanceMeters: 0, isValid: false, error: 'Invalid geofence radius' };
  }

  const distance = haversineDistance(
    workerCoords.latitude,
    workerCoords.longitude,
    siteCoords.latitude,
    siteCoords.longitude
  );

  if (Number.isNaN(distance)) {
    return { isInside: false, distanceMeters: 0, isValid: false, error: 'Distance computation failed' };
  }

  // Exactly on boundary (distance <= radiusMeters) is considered inside
  const isInside = distance <= radiusMeters;
  return {
    isInside,
    distanceMeters: distance,
    isValid: true,
  };
}

/**
 * Formats a distance in meters into human-readable string (meters or kilometers).
 *
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance (e.g. "45m" or "1.2km")
 */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return 'Unknown';
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
