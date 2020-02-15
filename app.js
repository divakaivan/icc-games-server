const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const url = `mongodb+srv://divakaivan:${process.env.DB_PASS}@cluster0-cniio.mongodb.net/test?retryWrites=true&w=majority`;
const bodyParser = require("body-parser");

const gamesRouter = require("./routes/games-routes");

const HttpError = require("http-errors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/games", gamesRouter);



app.use((req, res, next) => {
    // error handling for unsupported routes.
    throw new HttpError("Could not find this route", 404);
}); // this middleware will be reached only if we did not get a response from the above ones

app.use((error, req, res, next) => { // error handling middleware
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occurred!"});
});


mongoose
    .connect(url, {useNewUrlParser: true})
    .then(() => {
        app.listen(5000);
        console.log("Connected to database SUCCESSFUL")
    })
    .catch(err => {
        console.log(err);
    });
