const express = require("express");
const gamesController = require("../controllers/games-controller");

const router =express.Router();



router.get("/", gamesController.getGames);

router.get("/:team/all", gamesController.getGamesByTeam);

router.get("/:team/:gameId", gamesController.getGameById);

router.post("/", gamesController.addGame);

router.patch("/:gameId", gamesController.updateGame);

router.delete("/:gameId", gamesController.deleteGameById);


module.exports = router;
