# Fresh Commerce Recommendations API

Production-shaped demo service for the Erik James V12 Postman API Catalog.

## Endpoints

- `GET /health`
- `GET /recommendations`
- `POST /recommendations`
- `GET /recommendations/{recommendationId}`
- `PATCH /recommendations/{recommendationId}`
- `DELETE /recommendations/{recommendationId}`

## Run locally

```sh
npm start
```

The API listens on `http://localhost:3000`. Its OpenAPI 3.0 contract is [`index.yaml`](index.yaml).

## Catalog automation

The PEAS onboarding workflow generates a Postman workspace, baseline, smoke, and contract collections, a mock, disabled-by-default monitor, Production and Staging environments, Git linkage, CI, and API Catalog placement.
