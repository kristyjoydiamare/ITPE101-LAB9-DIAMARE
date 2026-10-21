const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000; // Render supplies PORT; 3000 is the local fallback

// Parse JSON request bodies
app.use(express.json());

// In-memory storage (resets when the server restarts)
let events = [
  { id: 1, title: "Intramurals Opening", date: "2026-11-05", location: "School Gym", organizer: "Student Council" },
  { id: 2, title: "Coding Workshop", date: "2026-11-12", location: "Computer Lab 2", organizer: "IT Society" },
];
let nextId = 3;

// Validate title/date/location/organizer. Returns an array of error messages.
// With partial = true (PATCH), only the fields that are present are checked.
function validateEvent(body, partial = false) {
  const errors = [];
  const fields = ["title", "date", "location", "organizer"];

  for (const field of fields) {
    const value = body[field];
    if (value === undefined) {
      if (!partial) errors.push(`${field} is required`);
      continue;
    }
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (typeof body.date === "string" && body.date.trim() !== "" && isNaN(Date.parse(body.date))) {
    errors.push("date must be a valid date (e.g., 2026-11-05)");
  }
  return errors;
}

// Root route: makes it easy to verify the deployment
app.get("/", (req, res) => {
  res.json({ message: "School Events API is running", endpoints: "/api/events" });
});

// READ ALL
app.get("/api/events", (req, res) => {
  res.status(200).json(events);
});

// READ ONE
app.get("/api/events/:id", (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }
  res.status(200).json(event);
});

// CREATE
app.post("/api/events", (req, res) => {
  const errors = validateEvent(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const { title, date, location, organizer } = req.body;
  const newEvent = {
    id: nextId++,
    title: title.trim(),
    date: date.trim(),
    location: location.trim(),
    organizer: organizer.trim(),
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// UPDATE (PUT = full replace, all fields required)
app.put("/api/events/:id", (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }

  const errors = validateEvent(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const { title, date, location, organizer } = req.body;
  event.title = title.trim();
  event.date = date.trim();
  event.location = location.trim();
  event.organizer = organizer.trim();
  res.status(200).json(event);
});

// UPDATE (PATCH = partial update, only the fields sent)
app.patch("/api/events/:id", (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }

  const body = req.body || {};
  const errors = validateEvent(body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  for (const field of ["title", "date", "location", "organizer"]) {
    if (body[field] !== undefined) event[field] = body[field].trim();
  }
  res.status(200).json(event);
});

// DELETE
app.delete("/api/events/:id", (req, res) => {
  const index = events.findIndex((e) => e.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }

  const [removed] = events.splice(index, 1);
  res.status(200).json({ message: "Event deleted successfully", deleted: removed });
});

// Handle malformed JSON bodies
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next(err);
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
