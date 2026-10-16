# Performance tests

The [k6 store-search script](./k6/store-search.js) uses a ramping arrival rate against the closest-store endpoint. It randomly selects coordinates around Bogotá, Medellín, Cali, and Bucaramanga by default. Set `TARGET_RPS` to define the target; the script derives four one-minute stages:

1. `0 → 25%` of `TARGET_RPS`;
2. `25% → 75%` of `TARGET_RPS`;
3. `75% → 100%` of `TARGET_RPS`;
4. `100% → 0` requests per second.

```bash
k6 run -e BASE_URL=http://localhost:3000 -e TARGET_RPS=500 performance/k6/store-search.js
```

The script requires:

- p95 latency below 300 ms;
- fewer than 1% actual HTTP failures;
- zero dropped iterations from insufficient VUs;
- successful checks for both `200` responses and expected `404` no-store responses.

Configuration variables:

- `BASE_URL`: API URL; defaults to `http://localhost:3000`.
- `TARGET_RPS`: target request rate used to calculate all stages; defaults to `500`.
- `PRE_ALLOCATED_VUS`: initially allocated virtual users; defaults to `200`.
- `MAX_VUS`: maximum virtual users; defaults to `1000`.
- `LATENCY_TARGET_MS`: p95 threshold; defaults to `300`.
- `CITY`: optionally restricts random coordinates to `bogota`, `medellin`, `cali`, or `bucaramanga`.
- `COORDINATE_JITTER`: maximum random offset in degrees around the selected city center; defaults to `0.05`.
- `LATITUDE` and `LONGITUDE`: optionally use a fixed coordinate instead of randomized coordinates.

Increase `PRE_ALLOCATED_VUS` or `MAX_VUS` if k6 reports that it cannot maintain the configured arrival rate.

The request URL contains randomized coordinates, but the script assigns the fixed k6 `name` tag `GET /v1/stores/closest`. This keeps k6 from creating one time series per unique latitude/longitude URL.

If k6 reports insufficient VUs, first inspect latency and resource saturation. For an arrival rate, the approximate VU requirement is:

```text
required VUs ≈ target requests/second × average request duration in seconds
```

For example, 500 requests/second at 300 ms requires approximately 150 active VUs. Reaching the 1,000 VU maximum indicates the service is taking approximately 2 seconds or more per request at that load, or that requests are queuing. Increasing `MAX_VUS` can let the test continue, but it does not demonstrate that the 300 ms target is being met.

## Dashboard report

Enable k6's web dashboard and export the report to an HTML file. If `REPORT_NAME` is not provided, the report defaults to `store-search-dashboard.html`:

```bash
REPORT_NAME="${REPORT_NAME:-store-search-dashboard.html}"
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_OPEN=false \
K6_WEB_DASHBOARD_EXPORT="$REPORT_NAME" \
k6 run -e BASE_URL=http://localhost:3000 -e TARGET_RPS=500 performance/k6/store-search.js
```

To use a custom report name:

```bash
REPORT_NAME=medellin-100rps.html
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_OPEN=false \
K6_WEB_DASHBOARD_EXPORT="$REPORT_NAME" \
k6 run -e CITY=medellin -e TARGET_RPS=100 performance/k6/store-search.js
```

The exported HTML report includes the latency percentiles, request rate, failures, checks, and custom no-store metrics.

## Measuring no-store responses

HTTP `404` is an expected business response when no open store is available. The script marks both `200` and `404` as expected HTTP statuses, so normal no-store responses do not count as transport failures.

It separately records:

- `store_search_404_total`: number of no-store responses;
- `store_search_404_rate`: proportion of requests returning `404`.

Both metrics include a `city` tag. For example, to test only Medellín:

```bash
k6 run -e CITY=medellin -e TARGET_RPS=100 performance/k6/store-search.js
```
