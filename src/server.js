const express = require("express");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

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

// Writes users input data into the db.json file
//const writeNotesToFile = async (notes) => {
//  const filePath = path.join(__dirname, "../../db/db.json");
//  await writeFileAsync(filePath, JSON.stringify(notes));
//};

// Saves notes to db.json file
const saveNotes = (req, res) => {
  const newNote = req.body;
  console.log(req.body);
};

// Routes
// HTML
app.get("/", serveIndexFile);
app.get("/notes", serveNotesFile);
// API
app.get("/api/notes", getNotes);
app.post("/api/notes", saveNotes);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
