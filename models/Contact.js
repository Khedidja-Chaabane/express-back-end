const mongoose = require('mongoose'); // appel à la dépendance mongoose
const contactShema = mongoose.Schema({ // création du schéma pour la collection contact
nom : {type: String} ,  // créations des champs et leurs types 
prenom : { type: String}  , 
email : { type: String} ,
message : { type: String}
})
// exporter le schéma  pour pouvoir l'utiliser 
module.exports = mongoose.model('contact' , contactShema); 