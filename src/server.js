const express = require("express");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { parse } = require("path");

const PORT = process.env.PORT | 3060;

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
const getNotesFromFile = async (req, res) => {
  const filePath = path.join(__dirname, "/db/db.json");
  const notesData = await readFileAsync(filePath, "utf8");
  const notes = JSON.parse(notesData);
  return notes;
};

// Reads db.json file and returns saved notes
const getNotes = async (req, res) => {
  const notes = await getNotesFromFile();
  res.json(notes);
};

// Saves notes to db.json file
const saveNotes = async (req, res) => {
  const filePath = path.join(__dirname, "/view/notes.html");
  const databaseFilePath = path.join(__dirname, "/db/db.json");
  // Reads db.json file
  const readNotes = await readFileAsync(databaseFilePath, "utf8");
  const newNoteData = req.body;

  // Parses db file as a json object
  const parsedNotes = JSON.parse(readNotes);
  // Generates new ID for new note
  const generateIndex = parsedNotes.length + 1;

  // Adds note into the parsedNotes array
  parsedNotes.push({
    id: `${generateIndex}`,
    title: newNoteData.title,
    text: newNoteData.text,
  });

  // Writes parsedNotes array to db.json file
  await writeFileAsync(databaseFilePath, JSON.stringify(parsedNotes));
  // Sets success status and re renders page with updated notes
  res.status(200).sendFile(filePath);
};

// Deletes selected notes
const deleteNote = async (req, res) => {
  const filePath = path.join(__dirname, "/view/notes.html");
  const databaseFilePath = path.join(__dirname, "/db/db.json");
  // Reads db.json file
  const readNotes = await readFileAsync(databaseFilePath, "utf8");
  // Parses db file as a json object
  const parsedNotes = JSON.parse(readNotes);
  const startIndex = req.params.id - 1;

  parsedNotes.splice(startIndex, 1);

  // Writes parsedNotes array to db.json file
  await writeFileAsync(databaseFilePath, JSON.stringify(parsedNotes));
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
