const express = require("express");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const PORT = 3000;

const app = express();

// Promisify fs files
const readFileAsync = promisify(fs.readFile);
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Returns index.html file
const serveIndexFile = (req, res) => {
  const filePath = path.join(__dirname, "../../index.html");
  res.sendFile(filePath);
};

// Returns notes.html file
const serveNotesFile = (req, res) => {
  const filePath = path.join(__dirname, "../../notes.html");
  res.sendFile(filePath);
};

// Reads db.json file and returns saved notes
const getNotes = async (req, res) => {
  const filePath = path.join(__dirname, "../../db/db.json");
  console.log(filePath);
  const notesData = await readFileAsync(filePath, "utf8");
  const notes = JSON.parse(notesData);
  res.json(notes);
};

// Receives new note and saves to db.json
const saveNotes = (req, res) => {};

// Routes
app.get("/", serveIndexFile);
app.get("/notes", serveNotesFile);
app.get("/api/notes", getNotes);
app.post("/api/notes", saveNotes);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
