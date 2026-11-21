import http from "k6/http";
import { check } from "k6";
import { Counter, Rate } from "k6/metrics";

http.setResponseCallback(http.expectedStatuses(200, 404));

const baseUrl = __ENV.BASE_URL || "http://localhost:3000";
const targetRps = Number(__ENV.TARGET_RPS || 500);
const preAllocatedVUs = Number(__ENV.PRE_ALLOCATED_VUS || 200);
const maxVUs = Number(__ENV.MAX_VUS || 1000);
const latencyTargetMs = Number(__ENV.LATENCY_TARGET_MS || 300);
const coordinateJitter = Number(__ENV.COORDINATE_JITTER || 0.05);

const cities = {
  bogota: { latitude: 4.711, longitude: -74.0721 },
  medellin: { latitude: 6.2442, longitude: -75.5812 },
  cali: { latitude: 3.4516, longitude: -76.532 },
  bucaramanga: { latitude: 7.1193, longitude: -73.1227 },
};

const noStoreResponses = new Counter("store_search_404_total");
const noStoreRate = new Rate("store_search_404_rate");

export const options = {
  discardResponseBodies: true,
  scenarios: {
    store_search: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: "1s",
      stages: [
        { target: Math.round(targetRps * 0.25), duration: "1m" },
        { target: Math.round(targetRps * 0.75), duration: "1m" },
        { target: targetRps, duration: "1m" },
        { target: 0, duration: "1m" },
      ],
      preAllocatedVUs,
      maxVUs,
    },
  },
  thresholds: {
    http_req_duration: [`p(95)<${latencyTargetMs}`],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
    dropped_iterations: ["count==0"],
  },
};

export default function () {
  const city = selectCity();
  const latitude = Number(__ENV.LATITUDE || city.latitude + randomOffset());
  const longitude = Number(__ENV.LONGITUDE || city.longitude + randomOffset());
  const response = http.get(
    `${baseUrl}/v1/stores/closest?latitude=${latitude}&longitude=${longitude}`,
    {
      tags: {
        name: "GET /v1/stores/closest",
        endpoint: "find_closest_store",
        city: city.name,
      },
    },
  );

  const isNoStoreResponse = response.status === 404;
  noStoreResponses.add(isNoStoreResponse ? 1 : 0, { city: city.name });
  noStoreRate.add(isNoStoreResponse ? 1 : 0, { city: city.name });

  check(response, {
    "store search returns an expected status": (result) =>
      result.status === 200 || result.status === 404,
  });
}

function selectCity() {
  const requestedCity = (__ENV.CITY || "").toLowerCase();
  if (requestedCity && cities[requestedCity]) {
    return { ...cities[requestedCity], name: requestedCity };
  }

  if (__ENV.LATITUDE || __ENV.LONGITUDE) {
    return { latitude: 0, longitude: 0, name: "custom" };
  }

  const cityNames = Object.keys(cities);
  const name = cityNames[Math.floor(Math.random() * cityNames.length)];
  return { ...cities[name], name };
}

function randomOffset() {
  return (Math.random() * 2 - 1) * coordinateJitter;
}
