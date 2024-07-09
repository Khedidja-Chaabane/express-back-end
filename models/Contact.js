const mongoose = require('mongoose'); // on appelle la dépendance mongoose

const contactShema = mongoose.Schema({ // on crée un schéma pour la collection contact
nom : {type: String} ,  // on crée un champ nom de type String , on peut aussi l'écrire comme ça : type : "string"
prenom : { type: String}  , 
email : { type: String} ,
message : { type: String}
})

module.exports = mongoose.model('contact' , contactShema); // on exporte le schéma contact pour pouvoir l'utiliser dans le fichier