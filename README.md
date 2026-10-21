# School Events API

A RESTful API for managing school organization events (create, read, update, and delete). Built for ITPE101 Laboratory Activity 9.

## Technologies Used

- Node.js
- Express.js
- Postman (testing)
- GitHub (version control)
- Render (deployment)

## Installation and Local Execution

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd school-events-api
npm install
npm start
```

The server runs on `http://localhost:3000` by default, or on the port set in `process.env.PORT`.

## Endpoints

| Method | Route               | Purpose                          |
|--------|---------------------|----------------------------------|
| GET    | `/`                 | API status message               |
| GET    | `/api/events`       | Retrieve all events              |
| GET    | `/api/events/:id`   | Retrieve one event               |
| POST   | `/api/events`       | Create a new event               |
| PUT    | `/api/events/:id`   | Replace an event (all fields)    |
| PATCH  | `/api/events/:id`   | Update some fields of an event   |
| DELETE | `/api/events/:id`   | Delete an event                  |

## Example Request Body (POST /api/events)

```json
{
  "title": "Science Fair",
  "date": "2026-12-01",
  "location": "Main Hall",
  "organizer": "Science Club"
}
```

Required fields: `title`, `date` (valid date), `location`, `organizer`.

## Status Codes

- `200` OK
- `201` Created
- `400` Validation failed or invalid JSON
- `404` Event or route not found

## Links

- GitHub Repository: https://github.com/your-username/your-repository
- Render Deployment: https://your-service-name.onrender.com

## Known Limitations

- Data is stored in an in-memory array, so all records reset when the server restarts or the Render instance is replaced.
- No authentication or database.
- On Render's free tier, the first request after inactivity may be slow while the service wakes up.
