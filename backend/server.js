//Treat these as imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Mongoose connects to the db based on uri
const uri = process.env.URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Adds routes for express to use
//Example route: http://localhost:5000/example/add
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter);

const profileRouter = require('./routes/profile');
app.use('/profile', profileRouter);

const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

const settingsRouter = require('./routes/settings');
app.use('/settings', settingsRouter);

const teamsRouter = require('./routes/team');
app.use('/teams', teamsRouter);

const postRouter = require('./routes/post');
app.use('/post', postRouter)

const triviaRouter = require('./routes/triviaVersus');
app.use('/trivia', triviaRouter)

const soloTriviaRouter = require('./routes/triviaSolo');
app.use('/trivia/solo', soloTriviaRouter)

//App is now listening for calls
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});