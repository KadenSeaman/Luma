require('dotenv').config();

const express = require('express');
const app = express()

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));


mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to mongoose'))


const diagramRoute = require('./routes/diagram');

app.use(express.json());
app.use('/diagrams', diagramRoute);

app.listen(process.env.PORT, () => {
    console.log('App is listening on PORT ' + process.env.PORT)
})