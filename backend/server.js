//Treat these as imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//Mongoose connects to the db based on uri
const uri = process.env.URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Adds routes for express to use
//Example route: http://localhost:5000/example/add
const exampleRouter = require('./routes/example');
const loginRouter = require('./routes/login');
app.use('/example', exampleRouter);
app.use('/login', loginRouter);

const profileRouter = require('./routes/profile');
app.use('/profile', profileRouter);

const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

//App is now listening for calls
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});