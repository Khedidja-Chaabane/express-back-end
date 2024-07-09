const mongoose = require('mongoose');
const carShema = mongoose.Schema({
    marque: {type: String},
    modele: {type: String},
    description: {type:String},
    image: {type:String}
});
module.exports = mongoose.model('car', carShema);