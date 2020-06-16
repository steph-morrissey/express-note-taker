const express = require("express");

const PORT = 3000;

const app = express();

const serveIndexFile = () => {};
const serveNotesFile = () => {};
const getNotes = () => {};
const saveNotes = () => {};

app.get("/", serveIndexFile);
app.get("/notes", serveNotesFile);
app.get("/api/notes", getNotes);
app.post("/api/notes", saveNotes);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
