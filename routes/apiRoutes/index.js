const router = require("express").Router();
const db = require("../../db");

// requests data from readNotes
router.get("/notes", (req, res) => {
  db.readNotes().then((notes) => {
    return res.json(notes);
  });
});

// submits data by writing (req.body) onto front end
router.post("/notes", (req, res) => {
  db.writeNote(req.body).then((notes) => {
    return res.json(notes);
  });
});

// deletes note
router.delete("/notes/:id", (req, res) => {
  db.removeNote(req.params.id)
    .then( () => {
      res.json({
        ok: true,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;