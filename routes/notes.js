const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authenticate = require("../middlewares/authenticate");
const Note = require("../models/Note");

// ROUTE 1: Get all the notes of logged in user: "GET /api/notes/". Requires authentication.
router.get("/", authenticate, async (req, res) => {
    try {
        const notes = await Note.find({user: req.user.id});
        res.status(200).json({status: "success", message: "Fetched notes successfully.", notes: notes});
    } catch(err) {
        console.log(err.message);
        res.status(500).json({status: "error", message: "Some internal error occurred."});
    }
});

// ROUTE 2: Add a new note: "POST /api/notes/add". Requires authentication.
router.post("/add", authenticate, [
    body("title", "Enter a valid title.").notEmpty(),
    body("description", "Enter a valid description.").notEmpty(),
], async (req, res) => {
    // If there are errors, return bad request and the errors array.
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: errors.array()[0].msg });
    }
    // If no errors found.
    try {
        const {title, description, tag} = req.body;
        let noteData = {
            title: title,
            description: description,
            user: req.user.id
        };
        if(tag) noteData.tag = tag;
        const note = new Note(noteData);
        const savedNote = await note.save();
        res.status(200).json({status: "success", message: "Added note successfully.", note: savedNote});
    } catch(err) {
        console.log(err.message);
        res.status(500).json({status: "error", message: "Some internal error occurred."});
    }
});

// ROUTE 3: Update existing note: "PATCH /api/notes/update/{id}". Requires authentication.
router.patch("/update/:id", authenticate, async (req, res) => {
    const {title, description, tag} = req.body;
    try {
        let data = {};
        if(title) data.title = title;
        if(description) data.description = description;
        if(tag) data.tag = tag;
        if(data.isEmpty) {
            return res.status(400).json({status: "error", message: "Contents to be updated not available."});
        }
        const note = await Note.findById(req.params.id);
        // Check if note with given ID exists.
        if(!note) {
            return res.status(404).json({status: "error", message: "Note with the given ID not found."});
        }
        // Check if logged in user is the same as owner of the note.
        if(note.user != req.user.id) {
            return res.status(401).json({status: "error", message: "Unauthorized access restricted."});
        }
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, data, {
            new: true
        });
        res.status(200).json({status: "success", message: "Successfully updated the note.", note: updatedNote});
    } catch(err) {
        console.log(err.message);
        res.status(500).json({status: "error", message: "Some internal error occurred."});
    }
});

// ROUTE 4: Delete existing note: "DELETE /api/notes/delete/{id}". Requires authentication.
router.delete("/delete/:id", authenticate, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        // Check if note with given ID exists.
        if(!note) {
            return res.status(404).json({status: "error", message: "Note with the given ID not found."});
        }
        // Check if logged in user is the same as owner of the note.
        if(note.user != req.user.id) {
            return res.status(401).json({status: "error", message: "Unauthorized access restricted."});
        }
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({status: "success", message: "Successfully deleted the note.", note: deletedNote});
    } catch(err) {
        console.log(err.message);
        res.status(500).json({status: "error", message: "Some internal error occurred."});
    }
});

module.exports = router;