// Required variables
const express = require("express");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

// PORTS
const PORT = process.env.PORT || 3001;

// Express
const app = express();

// Promisify fs files
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// Returns index.html file
const serveIndexFile = (req, res) => {
  console.log(path.join(__dirname, "/index.js"));
  const filePath = path.join(__dirname, "/view/index.html");
  res.sendFile(filePath);
};

// Returns notes.html file
const serveNotesFile = (req, res) => {
  const filePath = path.join(__dirname, "/view/notes.html");
  res.sendFile(filePath);
};

// Reads the db.json file and returns the data
const getNotesFromFile = async () => {
  const filePath = path.join(__dirname, "/db/db.json");
  const notesData = await readFileAsync(filePath, "utf8");
  const parsedNote = JSON.parse(notesData);
  return parsedNote;
};

// Writes transformed notes array into db.json
const writeNotesToFile = async (parsedNote) => {
  const databaseFilePath = path.join(__dirname, "/db/db.json");
  // Writes parsedNote array to db.json file
  await writeFileAsync(databaseFilePath, JSON.stringify(parsedNote));
};

// Reads db.json file and returns saved notes
const getNotes = async (req, res) => {
  const notes = await getNotesFromFile();
  res.json(notes);
};

// Saves notes to db.json file
const saveNotes = async (req, res) => {
  const newNoteData = req.body;
  const filePath = path.join(__dirname, "/view/notes.html");

  // Reads db.json file
  const parsedNote = await getNotesFromFile();

  // Generates new ID for new note
  const generateIndex = parsedNote.length + 1;

  // Adds note into the parsedNotes array
  parsedNote.push({
    id: `${generateIndex}`,
    title: newNoteData.title,
    text: newNoteData.text,
  });

  // Writes transformed data to db.json
  await writeNotesToFile(parsedNote);

  // Sets success status and re renders page with updated notes
  res.status(200).sendFile(filePath);
};

// Deletes selected notes
const deleteNote = async (req, res) => {
  const filePath = path.join(__dirname, "/view/notes.html");

  // Reads db.json file
  const parsedNote = await getNotesFromFile();

  // Index in the array of note to be deleted
  const startIndex = req.params.id - 1;
  parsedNote.splice(startIndex, 1);

  // Re assigns ID property indexes from 0 for each object in array
  parsedNote.map((note, index) => {
    note.id = `${index}`;
  });
  console.log(parsedNote);
  // Writes transformed data to db.json
  await writeNotesToFile(parsedNote);

  // Sets success status and re renders page with updated notes
  res.status(200).sendFile(filePath);
};

// Routes
// HTML
app.get("/", serveIndexFile);
app.get("/notes", serveNotesFile);
// API
app.get("/api/notes", getNotes);
app.post("/api/notes", saveNotes);
app.delete("/api/notes/:id", deleteNote);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
