const mongoose = require('mongoose'); // on appelle la dépendance mongoose

const blogShema = mongoose.Schema({ // on crée un schéma pour la collection blog
titre : {type: String} ,  
auteur: { type: String} , 
description : { type: String}  , 
message : { type: String}
})

module.exports = mongoose.model('blog' , blogShema); // on exporte le schéma blog pour pouvoir l'utiliser 