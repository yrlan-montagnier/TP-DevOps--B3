import express from 'express';

const app = express(); // Permet l'utilisation de express pour le serveur web.
const PING_LISTEN_PORT = 8080; // Définit le port sur lequel se lance le serveur web

///////////////Page d'accueil///////////////
app.get('/', (req, res) => {
    res.send('This is a test web page!');
})
////////////////////////////////////////////

///Récupérer les Headers et les mettres dans un JSON///
app.get('/ping', (req, res) => {
    res.send(req.headers);
})
///////////////////////////////////////////////////////

///ERREUR 404///
app.all('*', (req, res) => {
  res.status(404).send();
});    

///Lancement du serveur///
app.listen(PING_LISTEN_PORT, () => {
    console.log('The application is listening on port ' + PING_LISTEN_PORT + ' !');
})
//////////////////////////
