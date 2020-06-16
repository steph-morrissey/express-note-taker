const express = require("express");
const path = require("path");

const PORT = 3000;

const app = express();

const serveIndexFile = (req, res) => {
  const filePath = path.join(__dirname, "../../index.html");
  res.sendFile(filePath);
};
const serveNotesFile = (req, res) => {
  const filePath = path.join(__dirname, "../../notes.html");
  res.sendFile(filePath);
};
const getNotes = (req, res) => {};
const saveNotes = (req, res) => {};
// Routes
app.get("/", serveIndexFile);
app.get("/notes", serveNotesFile);
app.get("/api/notes", getNotes);
app.post("/api/notes", saveNotes);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
