const express = require("express");
const {check} = require("express-validator");

const gamesController = require("../controllers/games-controller");

const router =express.Router();



router.get("/", gamesController.getGames);

router.get("/:team/all", gamesController.getGamesByTeam);

router.get("/:gameId", gamesController.getGameById);

router.post("/",
    [
        check("red")
            .not()
            .isEmpty(),
        check("blue")
            .not()
            .isEmpty(),
        check("champions")
            .isArray(),
        check("videoLink")
            .isURL()
    ],
    gamesController.addGame);

router.patch("/:gameId",
    [
        check("red")
            .not()
            .isEmpty(),
        check("blue")
            .not()
            .isEmpty(),
        check("champions")
            .isArray(),
        check("videoLink")
            .isURL()
    ],
    gamesController.updateGame);

router.delete("/:gameId", gamesController.deleteGameById);


module.exports = router;
