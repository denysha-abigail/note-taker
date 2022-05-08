//db.js 

const fs = require("fs");
const util = require("util");
const generateUniqueId = require("generate-unique-id");

//util.promisify - takes a function callback and returns a version that returns promises
//util.promisify a read and write file
const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

// use class from last challenge for 'Notes'
// gets the db.json file and reads it in utf8 format
class Notes {
  read() {
    return readAsync("db/db.json", "utf8");
  }

  //takes the note entered from the user, stringify it, then write it in the db.json file
  write(note) {
    return writeAsync("db/db.json", JSON.stringify(note));
  }

  readNotes() {
    return this.read().then((notes) => {
      let allNotes;

      //try and catch is similar to if and else
      try {
          //allNotes is combined with the parsed 'notes'
        allNotes = [].concat(JSON.parse(notes));
      } catch (err) {
          //if no 'notes', then return empty array
        allNotes = [];
      }
      return allNotes;
    });
  }

  writeNote(note) {
      //deconstruct title/text
    const { title, text } = note;

    const newId = generateUniqueId();

    const newNote = {
      title,
      text,
      id: newId
    };

    return this.readNotes()
        //add 'newNote' along with current notes, instead of overwriting
      .then((notes) => [...notes, newNote])
      .then((newNotesArray) => this.write(newNotesArray));
  }

    //delete bonus
    removeNote(noteId) {

      return this.readNotes()
        //filter notes to return only
        .then((notes) => notes.filter(note => note.id !== noteId))
        .then((newNotesArray) => this.write(newNotesArray));
    }
}

module.exports = new Notes();