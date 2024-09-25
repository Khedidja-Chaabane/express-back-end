var express = require('express');  //appel de la dépendance express 
var app = express();  // app comme le nom du fichier app.js // on met la dépendance express dans la variable app

var Contact = require('./models/Contact'); // on importe le model Contact qui se trouve dans le fichier models/Contact.js

var Blog = require('./models/Blog'); // on importe le model Blog 

var Car = require('./models/Car');
var User = require('./models/User');
var bodyParser = require('body-parser');  // on appelle la dépendance body parser

app.use(bodyParser.urlencoded({ extended: false })); // on utilise la dépendance body-parser avec l'option extended: false pour que le serveur puisse traiter les informations qui sont encodées en format urlencoded

require('dotenv').config(); // on appelle la dépendance dotenv pour charger les variables d'environnement

var cors = require ('cors'); // on appelle la dépendance cors pour autoriser la récupération des donées 
app.use(cors()); // on utilise la dépendance cors pour autoriser la récupération des donées // les parentheses vides sont obligatoires pour utiliser les middleware sinon on doit spécifier les autorisations dedans

var mongoose = require('mongoose'); // on appelle la dépendance mongoose

// const url = "mongodb+srv://codeuseimparfaite:080916@cluster0.kqfvxwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" // on crée une const url et on colle le lien de connexion à la base de données entre les ""
//j'ai commenté la ligne de l'url pour écrire la nouvelle ligne ci-dessous

const url = process.env.DATABASE_URL; // on récupère la variable d'environnement DATABASE_URL qui se trouve dans le fichier .env
mongoose.connect(url) // on appelle la fonction connect de mongoose avec l'url de connexion
    .then(console.log("Mongodb connectée !")) // on affiche la connexion à la base de données réussie
    .catch(error => console.log(error)); // on affiche l'erreur si la connexion à la base de données échoue

// on définit le moteur de template à utiliser pour les vues
// qui est ejs dans le dossier views
app.set('view engine', 'ejs'); 

// on appelle la dépendance method-override apres son installation
const methodOverride = require('method-override'); 
// on utilise la dépendance method-override ;
// des qu'on voit un _method dans l'URL, c'est qu'on utilise la methode override
app.use(methodOverride('_method'));

const bcrypt = require('bcrypt'); // Appel de la dépendance bcrypt

//appel de cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//appel du fichier JWT.js
const {createToken , validateToken} = require('./JWT');     

const multer = require('multer');
app.use(express.static('uploads'));
// app.use(express.static('public'));
//---------------------------------------------------------------------------------------------------------------
//form 2eme jour

app.post('/nouveauContact', function (req, res) {  // on crée une route sur l'URL 

    console.log(req.body);
    const Data = new Contact({         // on crée une const Data  et on lui affecte un nouveau Contact "Contact est le nom de mon model"
        nom: req.body.nom,
        prenom: req.body.prenom,  // on fait un matching entre les champs créés dans le model et les champs du formulaire "les name"
        email: req.body.email,
        message: req.body.message
    })
    Data.save()  // on enregistre les données dans la bdd 
        .then(() => {
            console.log("Contact saved !");  // on affiche "Contact saved !" 
            // res.end();            // on ferme la connexion 
            res.redirect("http://localhost:3000/contacts");          // on rederige vers le front
        })
        .catch(error => console.log(error)); // on affiche l'erreur 
});
//READ
//afficher la liste des contacts
app.get('/',validateToken, function (req, res) {  // on crée une route sur l'URL  // on ajoute validatetoken pour autoriser l'acces uniquement à un user connecté 
    Contact.find()                          // on va chercher les données stockés dans la bdd
        .then(data => {     // on afficheles données // on passe en paramètre les données stockées dans la variable data 
            // res.render('Home', { dataHome: data });   // le rendu sera la page home et les données seront affichés dessus   //  on affecte les données à une valeur dataHome  
            res.json(data); // on renvoie les données sous forme de json // 1ere étape pour lier le backend avec le front : mettre les données à dispo    
        })
        .catch(error => console.log(error));
});

//CREATE
app.get('/nouveauContact', function (req, res) {
    res.render('newContact');
});

//UPDATE
//afficher un contact et permettre de le modifier
//1ere étape récupérartion de la donnée
app.get('/contact/:id', function (req, res) {
    Contact.findOne({
        _id: req.params.id             // _id c'est l'id comme elle est marquée dans mongodb // params fait reférence à l'id dans l'url // on fait un matching entre l'id de la donnée et l'id de l'url
    }).then(data => {
        // res.render('EditContact', { data: data });
        res.json(data); 
    })
        .catch(error => console.log(error));
});

//2eme étape mise à jour des données
app.put('/updateContact/:id', function (req, res) {    // on crée une route sur l'URL avec :id pour récupérer l'id de la donnée , on utilise app.put car on veut mettre à jour les données
    const Data = {                                   // on crée une const Data et on lui affecte les données du formulaire
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        message: req.body.message
    }
    //matching data: on fait un matching entre les id des données dans la bdd et celles presentes dans l'url
    Contact.updateOne({
        _id: req.params.id           // on récupère l'id de la donnée
    }, { $set: Data })                  // avec $set on met à jour les données
        .then(result => {
            console.log(result);
            console.log("contact updated !");
            res.redirect('http://localhost:3000/contacts');
        })
        .catch(error => console.log(error));
});


//DELETE
app.delete('/contact/deleteContact/:id', function (req, res) {
    Contact.findOneAndDelete({
        _id: req.params.id
    }).then(() => {
        console.log("contact deleted !");
        res.redirect('http://localhost:3000/co0ntacts');
    }).catch(error => console.log(error));
});

//var path = require('path'); //permet de lire le fichier index.html

// app.get('/', function(req, res){  // on crée une route sur l'URL et on dit que le serveur doit répondre à la requete du client
//     res.send('<html><body><h1>Express is awsome !</h1></body></html>')  
// });
///  app.get('/submit-form', function(req, res){   
//    res.sendFile(path.resolve("index.html"));  // avec path.resolve on dit au serveur de chercher le fichier index.html dans le dossier
// });

// app.get('/students', function(req, res){  //on affiche un h1 dans la page students tout en définisant le chemin /students
//     res.send('<html><body><h1>Page students</h1></body></html>')  
// });


// app.post('/submit-form' , function(req , res){   
// //console.log(req.body);  // on affiche dans la console les informations récupérées par le formulaire
// //console.log(req.body.firstname); //on affiche uniquement le nom
// //console.log("Votre nom est :" + req.body.firstname + " " + req.body.lastname + " ." ); 
// res.send("Votre nom est : " + req.body.firstname + "" + req.body.lastname + " ."); // on affiche le nom et le prénom récupérés par le formulaire dans la page html
// });



// //exo premier jour
// app.get('/contact', function(req, res){   //on crée une route sur l'URL 
//    res.sendFile(path.resolve("contact.html"));  // avec path.resolve on dit au serveur de chercher le fichier contact.html dans le dossier
// });

// app.post('/contact-form' , function(req , res){ // à travrs cette route on affiche  un message avec les informations récupérées par le formulaire  

//     res.send("Bonjour " + req.body.firstname + " " + req.body.lastname + " . <br> Merci de nous avoir contacté . <br> Nous reviendrons vers vous dans les plus brefs délais à cette adresse: " + req.body.email ); // on affiche le nom et le prénom récupérés par le formulaire dans la page html
//     });


//---------------------------------------------------------------------------
//EXERCICE CREUD / MY BLOG

//création de la route blog ou tout mes posts seront affichés
// on crée une route sur l'URL
app.get('/blog', function (req, res) { 
// on appelle le model Blog et on va chercher les données stockés dans la bdd  
    Blog.find() 
// on afficheles données  
// on passe en paramètre les données stockées dans la variable allposts                        
        .then(allposts => {
// le rendu sera la page blog et les données seront affichés dessus
//  on affecte les données à une valeur allposts 
res.render('Blog', { allposts: allposts });
           // res.json(allposts); // format json 
            console.log("Récupération des données réussie !");
        })
        .catch(error => console.log(error));
});

//creation de la route newPost pour afficher le formulaire de création d'un nouveau post
app.get('/newPost', function (req, res) {
    res.render('newPost');
});

//Route action du formulaire pour enregistrer un nouveau post
app.post('/newPost', function (req, res) {  // on crée une route sur l'URL 

    console.log(req.body);
    const Post = new Blog({ // on crée une const Post  et on lui affecte un nouveau Blog -le nom de mon model"
        // on fait un matching entre les champs créés dans le model et les champs du formulaire 
        titre: req.body.titre,
        auteur: req.body.auteur,                      
        description: req.body.description,  
        message: req.body.message
    })
    Post.save()  // on enregistre les données dans la bdd 
        .then(() => {
            console.log("Post saved !");
            res.redirect('/blog'); // on rederige vers la page blog
        })
        .catch(error => console.log(error)); // on affiche l'erreur 
});

//route page edit post
//afficher les données d'abord pour pouvoir les modifier ensuite
//on affiche le poste en fonction de son id dans l'url
app.get('/post/:id', function (req, res) {
    Blog.findOne({
        _id: req.params.id
    }).then(post => {
        //Affichage du post dans la vue
        res.render('EditPost', { post: post });
        //Affichage sous format json
        //res.json(post);
    })
        .catch(error => console.log(error));
});


//Route action du formulaire de modification
app.put('/updatePost/:id', function (req, res) {
    const Post = {
 // on fait un matching entre les champs créés dans le model et les champs du formulaire "les name" 
        titre: req.body.titre,
        auteur: req.body.auteur,                     
        description: req.body.description,  
        message: req.body.message
    }
//matching data: on fait un matching entre les id des données dans la bdd et celles presentes dans l'url
    Blog.updateOne({
        _id: req.params.id   // on récupère l'id de la donnée
    }, { $set: Post })      // avec $set on met à jour les données
        .then(post => {
        //Afficher un message dans la console
            console.log("Post updated !");
            res.redirect('/blog'); //redirection
        })
        .catch(error => console.log(error));
});

//Supprimer un post
app.delete('/deletePost/:id', function (req, res) {
    Blog.findOneAndDelete({
        _id: req.params.id
    }).then(() => {
        console.log("Post deleted !");
        res.redirect('/blog');
    }).catch(error => console.log(error));
});


//EXO CRUD MY CAR
//affichage de la vue formulaire de création d'une voiture
app.get('/newCarForm', function (req, res) {
    res.render('NewCar');
});
//Route de l'action du formulaire de création d'une voiture
app.post('/submit-car-form', function (req, res) {
    const Data = new Car({
        marque: req.body.marque,
        modele: req.body.modele,
        description: req.body.description,
        image: req.body.image
    });
    Data.save()
        .then(() => {
            console.log('Car saved!');
            res.redirect('/allCars');
        })
        .catch((error) => error);
});
// route pour afficher toutes les voitures
app.get('/allCars', function (req, res) {
    Car.find().then(data => {
        // res.render('AllCars', { data: data });
        res.json(data);
    })
        .catch(error => cosole.log(error));
})
    ;
// route pour afficher le formulaire de modification d'une voiture
app.get('/editCarForm/:id', function (req, res) {
    Car.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('EditCar', { data: data });
    }).catch(error => console.log(error));
});
// route de l'action du formulaire de modification d'une voiture
app.put('/edit-car-form/:id', function (req, res) {
    const Data = {
        marque: req.body.marque,
        modele: req.body.modele,
        description: req.body.description,
        image: req.body.image
    }
    Car.updateOne({ _id: req.params.id }, { $set: Data })
        .then((result) => {
            console.log(result);
            console.log('Car modifiée!');
            res.redirect('/allCars');
        })
        .catch(error => console.log(error));
});
//route pour supprimer une voiture
app.delete('/deleteCar/:id', function (req, res) {
    Car.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            console.log('Suppression réussie');
            res.redirect('/allCars');
        })
        .catch(error => console.log(error));
});


// USER

//afficher le formulaire de l'inscription
app.get('/inscription', function (req, res) {
    res.render('Inscription');
});

//route de l'action du formulaire d'inscription
//  /api avec post
app.post('/api/newuser', function (req, res) {
    var Data = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        admin: false
    })
    Data.save().then(() => {
        console.log('User saved!');
        res.redirect('/login');
    })
        .catch((error) => console.log(error));
});

//afficher la page de connexion
app.get('/login', function (req, res) {
    res.render('Connexion');
})

//route de l'action du formulaire de connexion "l'authentification"
app.post('/api/connexion', function (req, res) {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found : Invalid email');
            }
 
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(404).send('Password is incorrect : Invalid password');
            }

            const accessToken = createToken(user);  // on crée le token aprés avoir verifier si l'utilisateur existe ou pas
            res.cookie("access-token", accessToken, {   // 
                maxAge: 1000 *60* 60* 24 * 30  ,  // 30 jours en millisecondes
                httpOnly: true,          // les cookies seront accessibles uniquement via une requete http 
            });
            res.json("LOGGED IN");

            if (user.admin == true) {
                res.redirect('/admin');
            }

            else {
                res.render('Profil', { user: user }); // user: c'est la data qui va etre affichée dans la vue Profil.ejs et user c'est l'objet user qui contient les données de l'utilisateur
            }

        })
        .catch(error => console.log(error));
});

//route déconnexion
app.get('/logout', function(req, res){
    res.clearCookie("access-token");
    res.redirect('http://localhost:3000/')
});
//

app.get('/getJWT', function(req, res){
    res.json(req.cookies.accessToken);
});

app.get('/admin', function (req, res) {
    User.find().then(users => {
        res.render('Admin', { users: users });
    })
        .catch(error => console.log(error));
});

// Configuration de multer pour définir où et comment les fichiers uploadés seront stockés
const storage = multer.diskStorage({
    // Définit le dossier de destination des fichiers uploadés
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Les fichiers seront stockés dans le dossier 'uploads'
    },
    // Définit le nom du fichier uploadé
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Le nom du fichier sera conservé tel qu'il a été uploadé (original)
    }
  });
  // Initialisation de multer avec la configuration 'storage'
const upload = multer({ storage });

// Route pour Upload image
app.post('/upload', upload.single('image'), (req, res) => {
  // Vérifie si un fichier a bien été uploadé
  if (!req.file) {
    // Si aucun fichier n'est trouvé, retourne une réponse d'erreur
    res.status(400).send('No file uploaded.');
  } else {
    // Si un fichier est trouvé, retourne un message de succès
    res.send('File uploaded successfully.');
  }
});

// Route pour upload pluieurs images
app.post('/uploadmultipleimages', upload.array('images', 5), (req, res)=>{
    
    if(!req.files || req.files.length === 0){
        res.status(400).send('No file uploaded !');
    }
    else{
        res.send('File uploaded successfully');
    }
})


//on met le serveur à la fin et les dépendances au début du code

var server = app.listen(5000, function () {   // on lance le serveur sur le port 5000
    console.log('server running on port 5000');   //mettre un message dans la console quand le serveur est lancé

});