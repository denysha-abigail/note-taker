const fs = require("fs");
const util = require("util");
const generateUniqueId = require("generate-unique-id");

// util.promisify to take the readFile and writeFile function callbacks and return a version of them that returns promises
const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

// create Notes class
// gets db.json file and reads it in utf8 format
class Notes {
  read() {
    return readAsync("db/db.json", "utf8");
  }

  // takes submitted note, stringifies it, and writes it in the db.json file
  write(note) {
    return writeAsync("db/db.json", JSON.stringify(note));
  }

  readNotes() {
    return this.read().then((notes) => {
      let allNotes;

      // try and catch similar to if and else
      try {
          // allNotes is combined with the parsed 'notes'
        allNotes = [].concat(JSON.parse(notes));
      } catch (err) {
          // if no 'notes', then return empty array
        allNotes = [];
      }
      return allNotes;
    });
  }

  writeNote(note) {
      // deconstruct note title/text
    const { title, text } = note;

    const newId = generateUniqueId();

    const newNote = {
      title,
      text,
      id: newId
    };

    return this.readNotes()
        // add 'newNote' along with current notes, instead of overwriting them
      .then((notes) => [...notes, newNote])
      .then((newNotesArray) => this.write(newNotesArray));
  }

    // deletes note
    removeNote(noteId) {

      return this.readNotes()
        //filter notes to return only
        .then((notes) => notes.filter(note => note.id !== noteId))
        .then((newNotesArray) => this.write(newNotesArray));
    }
}

module.exports = new Notes();