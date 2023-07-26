const express = require('express');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config');

app.use(cors());

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', ()=> {
    console.log('connected');
});

mongoose.connection.on('error', (error)=> {
    console.log('some error ==>', error);
});

require('./models/user_model');
require('./models/post_model');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(require('./routes/authentication'));
app.use(require('./routes/postRoute'));
app.use(require('./routes/userRoute'));

app.listen(PORT, ()=> {
    console.log('app is listening to port ' + PORT);
});