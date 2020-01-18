const {validationResult} = require("express-validator");

const HttpError = require("../http-errors");

const Game = require("../models/game");

const getGames = async (req, res,next) => {
    let games;
    try {
        games = await Game.find({});
    } catch (err) {
        const error = new HttpError("Fetching games failed.", 500);
        return next(error);
    }

    res.status(200).json({games: games.map(game=>game.toObject({getters: true}))});
    // res.json({games: gamesList});
};

const getGameById = async (req, res, next) => {
    const gameId = req.params.gameId;

    let game;
    try {
        game = await Game.findById(gameId);
    } catch (err) {
        const error = new HttpError("Could not find a game for given id", 404);
        return next(error);
    }

    if (!game) {
        const error = new HttpError("Could not find a game for given id", 404);
        return next(error);
    }

    res.status(200).json({game: game.toObject({getters: true})});
};

const getGamesByTeam = async (req, res, next) => {
    const team = req.params.team;

    let games;
    try {
        games = await Game.find({$or: [{red: team}, {blue: team}]});
        // games = await gamesList.filter(game => game.blue === team || game.red === team)
    } catch (err) {
        const error = new HttpError("Fetching games failed. Try again,", 500);
        return next(error);
    }

    if (!games || games.length === 0) {
        return next(new HttpError(`Could not find games where ${team} has played. Maybe add one?`, 404))
    }

    res.status(200).json({games: games.map(game=>game.toObject({getters: true}))});
};

const addGame = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs given, please check your data.", 422));
    }

    const {red, blue, videoLink} = req.body;
    let {duration} = req.body;
    duration = Number(duration);

    let existingGame;
    try {
        existingGame = await Game.findOne({$and:[{red}, {blue}, {duration}, {videoLink}]}); // this method finds one document matching the criteria given in the method
    } catch (err) {
        const error = new HttpError("Adding a game failed. Try again", 500);
        return next(error);
    }

    if (existingGame) {
        const error = new HttpError("Game with this info exists already.", 422);
        return next(error);
    }

    const newGame = new Game({
        red,
        blue,
        videoLink,
        duration
    });
    try {
        await newGame.save(); // this saves a newGame to the db and creates the unique id
    } catch (err) {
        const error = new HttpError("Adding game failed.", 500);
        return next(error);
    }
    res.status(201).json({message: "Added a new game", game: newGame})
};

const updateGame = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs given, please check your data.", 422));
    }

    const { blue, red, duration, videoLink } = req.body;
    const gameId = req.params.gameId;

    let game;
    try {
        game = await Game.findById(gameId);
    } catch (err) {
        const error = new HttpError("Could not find game with given game id", 404);
        return next(error);
    }

    game.blue = blue;
    game.red = red;
    game.duration = duration;
    game.videoLink = videoLink;

    try {
        await game.save();
    } catch (err) {
        const error = new HttpError("Something went wrong. Could not update game info", 500);
        return next(error);
    }

    res.status(200).json({game: game.toObject({getters: true})});
};

const deleteGameById = async (req, res, next) => {
    const gameId = req.params.gameId;

    let game;
    try {
        game = await Game.findById(gameId);
    } catch (err) {
        const error = new HttpError("Something went wrong. Could not delete game", 500);
        return next(error);
    }

    if (!game) {
        const error = new HttpError("Could not find a game for the given id", 404);
        return next(error);
    }
    try {
        await Game.deleteOne(game);
    } catch (err) {
        const error = new HttpError("Could not delete game. Try again.", 500);
        return next(error);
    }

    res.status(200).json({message: "Game deleted."})
};



exports.deleteGameById = deleteGameById;
exports.getGamesByTeam = getGamesByTeam;
exports.getGames = getGames;
exports.addGame = addGame;
exports.updateGame = updateGame;
exports.getGameById = getGameById;
