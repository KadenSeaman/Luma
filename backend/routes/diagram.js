const express = require('express');
const router = express.Router();
const Diagram = require('../models/diagramModel');

// Create diagram
router.post('/', async (req, res) => {
    try{
        const newDiagram = new Diagram({
            title: req.body.title,
            userID: req.body.userID,
            tabs: req.body.tabs,
            favorite: req.body.favorite,
            editorContent: req.body.editorContent,
        })
        console.log(newDiagram);
        const savedDiagram = await newDiagram.save();
        console.log(savedDiagram);
        res.status(201).json( { id: savedDiagram._id });
    } catch(error){
        console.log(error);
        res.status(500).json({ error: 'Failed to create diagram'} );
    }
})

// Retrieve a diagram
router.get('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if(!document) return res.status(404).json({ error: 'Document not found' });
        res.json(document);
    } catch (error){
        res.status(500).json({ errorMessage: 'Error fetching document'})
    }
})

// Get all diagrams
router.get('/', async (req, res) => {
    try{
        const documents = await Diagram.find();
        res.json(documents);
    }
    catch (error){
        res.status(500).json({ error: 'Failed to fetch documents'});
    }
})

module.exports = router;