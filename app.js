const express = require("express");
const bodyParser = require("body-parser");
const gamesRouter = require("./routes/games-routes");

const HttpError = require("http-errors");

const app = express();

app.use(bodyParser.json());


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




app.listen("5000");
