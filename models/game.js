const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const gameSchema =new Schema({
    red: { type: String, required: true },
    blue: { type: String, required: true },
    champions: { type: Array, required: true },
    videoLink: { type: String, required: true }
});

module.exports = mongoose.model("Game", gameSchema);
