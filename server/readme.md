# Travel Helpers Server - API Documentation

## 1. Register

Register a new user.

- **Endpoint**: `/register`
- **Method**: `POST`
- **Headers**:
    - `Content-Type: application/json`
- **Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "yourpassword"
    }
    ```

**Sample `curl` Request**:

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "yourpassword"}' \
http://localhost:3000/register
```

## 2. Login

Authenticate an existing user.

- **Endpoint**: `/login`
- **Method**: `POST`
- **Headers**:
    - `Content-Type: application/json`
- **Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "yourpassword"
    }
    ```

**Sample `curl` Request**:

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "yourpassword"}' \
http://localhost:3000/login
```

On a successful login, this will return a JWT token. Save this token for accessing protected routes.

## 3. Dashboard

Access the dashboard of an authenticated user.

- **Endpoint**: `/dashboard`
- **Method**: `GET`
- **Headers**:
    - `Content-Type: application/json`
    - `Authorization: Bearer YOUR_JWT_TOKEN`

**Sample `curl` Request**:


```bash
curl -X GET \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
http://localhost:3000/dashboard
```

Database Testing

To run the functionality tests, use the following commands:
```bash
npm install
npx prisma migrate dev
npm run test
