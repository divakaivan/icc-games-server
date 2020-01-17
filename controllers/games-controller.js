const {validationResult} = require("express-validator");

const HttpError = require("../http-errors");
const uuid = require("uuid/v4");

let gamesList = [
    {
        id: uuid(),
        red: "FNC",
        blue: "G2",
        duration: 32,
        videoLink: "https://www.youtube.com/watch?v=6XWlPKsuBps"
    },
    {
        id: uuid(),
        red: "MSF",
        blue: "FNC",
        duration: 25,
        videoLink: "https://www.youtube.com/watch?v=6XWlPKsuBps"
    }
];

const getGames = async (req, res,next) => {
    res.json({games: gamesList});
};

const getGamesByTeam = async (req, res, next) => {
    const team = req.params.team;

    let games;
    try {
        games = await gamesList.filter(game => game.blue === team || game.red === team)
    } catch (err) {
        const error = new HttpError("Fetching games failed. Try again,", 500);
        return next(error);
    }

    if (!games || games.length === 0) {
        return next(new HttpError(`Could not find games where ${team} has played. Maybe add one?`, 404))
    }

    res.json({games: games});
};

const addGame = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs given, please check your data.", 422));
    }

    const {red, blue, videoLink} = req.body;
    let {duration} = req.body;

    let game;
    try {
        game = gamesList.find(game => game.red === red && game.blue === blue && game.duration === Number(duration) && game.videoLink === videoLink);
    } catch (err) {
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }

    if (game) {
        return next(new HttpError(`There is already a game with blue: ${blue} vs red:${red}. Duration ${duration} mins and a video: ${videoLink}`))
    }

    const newGame = {
        id: uuid(),
        red,
        blue,
        duration,
        videoLink
    };

    gamesList.push(newGame);

    res.json({message: "Added a new game", game: newGame})
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
        game = await gamesList.find(game => game.id === gameId);
        console.log(game)
    } catch (err) {
        const error = new HttpError("Could not find place with given game id", 404);
        return next(error);
    }

    game.blue = blue;
    game.red = red;
    game.duration = duration;
    game.videoLink = videoLink;



    res.status(201).json({message: "Game info updated!", game: game})
};

const getGameById = async (req, res, next) => {
    const gameId = req.params.gameId;
    const team = req.params.team;

    let game;
    try {
        game = await gamesList.find(game => game.id === gameId && (game.red === team || game.blue === team) );
    } catch (err) {
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }

    if (!game) {
        const error = new HttpError("Could not find a game for given id", 404);
        return next(error);
    }

    res.json({game: game});
};


const deleteGameById = async (req, res, next) => {
    const gameId = req.params.gameId;

    let game;
    try {
        game = gamesList.find(game => game.id === gameId);
    } catch (err) {
        const error = new HttpError("Something went wrong. Could not delete game", 500);
        return next(error);
    }

    if (!game) {
        const error = new HttpError("Could not find a game for the given id", 404);
        return next(error);
    }

    gamesList = gamesList.filter(game => game.id !== gameId);

    res.json({message: "Game deleted.", games: gamesList})
};



exports.deleteGameById = deleteGameById;
exports.getGamesByTeam = getGamesByTeam;
exports.getGames = getGames;
exports.addGame = addGame;
exports.updateGame = updateGame;
exports.getGameById = getGameById;
