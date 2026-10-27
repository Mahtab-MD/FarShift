import test from 'node:test';
import assert from 'node:assert/strict';
import {
  haversineDistance,
  checkGeofence,
  isValidCoordinate,
  formatDistance,
} from '../lib/haversine.ts';

test('isValidCoordinate accepts valid ranges and rejects out-of-bound coords', () => {
  assert.equal(isValidCoordinate(37.7749, -122.4194), true);
  assert.equal(isValidCoordinate(90, 180), true);
  assert.equal(isValidCoordinate(-90, -180), true);

  // Invalid ranges
  assert.equal(isValidCoordinate(91, 0), false);
  assert.equal(isValidCoordinate(-91, 0), false);
  assert.equal(isValidCoordinate(0, 181), false);
  assert.equal(isValidCoordinate(0, -181), false);
  assert.equal(isValidCoordinate(NaN, 0), false);
  assert.equal(isValidCoordinate(0, Infinity), false);
});

test('haversineDistance computes accurate distance between known landmarks', () => {
  // San Francisco City Hall to Ferry Building (~2.3km = ~2300m)
  const dist = haversineDistance(37.7792, -122.4191, 37.7955, -122.3937);
  assert.ok(dist > 2800 && dist < 3000, `Expected ~2900m, got ${dist}m`);

  // Same coordinates should have 0 distance
  assert.equal(haversineDistance(40.7128, -74.006, 40.7128, -74.006), 0);

  // Invalid coordinates should return NaN
  assert.ok(Number.isNaN(haversineDistance(100, 0, 0, 0)));
});

test('checkGeofence handles inside, outside, boundary, and invalid coordinates', () => {
  const site = { latitude: 37.7749, longitude: -122.4194 };
  const radius = 200; // 200 meters

  // 1. Inside geofence (50 meters away)
  const insideWorker = { latitude: 37.7752, longitude: -122.4194 };
  const insideResult = checkGeofence(insideWorker, site, radius);
  assert.equal(insideResult.isValid, true);
  assert.equal(insideResult.isInside, true);
  assert.ok(insideResult.distanceMeters < 100);

  // 2. Outside geofence (1000 meters away)
  const outsideWorker = { latitude: 37.784, longitude: -122.4194 };
  const outsideResult = checkGeofence(outsideWorker, site, radius);
  assert.equal(outsideResult.isValid, true);
  assert.equal(outsideResult.isInside, false);
  assert.ok(outsideResult.distanceMeters > 500);

  // 3. Exactly on boundary
  // If radius is exactly equal to the distance, it must evaluate to inside
  const dist = insideResult.distanceMeters;
  const boundaryResult = checkGeofence(insideWorker, site, dist);
  assert.equal(boundaryResult.isInside, true);

  // 4. Invalid coordinates
  const invalidResult = checkGeofence({ latitude: 120, longitude: 0 }, site, radius);
  assert.equal(invalidResult.isValid, false);
  assert.equal(invalidResult.isInside, false);
});

test('formatDistance formats meters and kilometers accurately', () => {
  assert.equal(formatDistance(50), '50m');
  assert.equal(formatDistance(999), '999m');
  assert.equal(formatDistance(1500), '1.5km');
  assert.equal(formatDistance(-10), 'Unknown');
});
