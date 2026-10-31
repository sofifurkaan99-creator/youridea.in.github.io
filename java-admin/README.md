# youridea.in Java Admin Backend

This project is the Java full-stack upgrade for your site.

## Run locally

```bash
cd java-admin
mvn spring-boot:run
```

Then open:
- http://localhost:8080/api/health
- http://localhost:8080/h2-console

## Default admin login

- username: `admin`
- password: `admin123`

## APIs

- `POST /api/auth/login`
- `GET /api/overview`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/{id}`
- `GET /api/enquiries`
- `POST /api/enquiries`
- `PATCH /api/enquiries/{id}/status`
- `GET /api/services`
- `POST /api/services`
- `DELETE /api/services/{id}`
- `GET /api/pricing`
- `POST /api/pricing`
- `DELETE /api/pricing/{id}`

## Notes

This starter uses H2 in-memory storage for local development so it runs immediately. For production, replace the datasource with PostgreSQL and add environment-based configuration.
