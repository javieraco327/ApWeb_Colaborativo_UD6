const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
let ejs = require('ejs');
const aplicacion = express()
const puerto = 8000

// ########## SE ESTABLECE CONEXION CON MONGODB

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ASWGrupo1:ASWGrupo1@aswgrupo1.yods9.mongodb.net/?retryWrites=true&w=majority&appName=ASWGrupo1";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

try {
  client.connect();
  console.log("Conectado a MongoDB");
}
catch {
  console.log("Error de conexion a MongoDB");
  process.kill();
}

// ########## SE DEFINE EL SISTEMA DE PLANTILLAS Y EL DIRECTORIO DONDE SE GUARDAN
aplicacion.set('view engine', 'ejs')
aplicacion.set('views', './views')

// ########## SE DEFINE UN DIRECTORIO PARA CONTENIDO ESTATICO (IMAGENES, CSS....) Y ASI SE EVITA TENER QUE CREAR RUTAS PARA TODO. Las rutas se toman con respecto a ese directorio.
aplicacion.use(express.static(__dirname + '/static'))

// ########## SE USA bodyParser COMO MIDDLEWARE PARA PODER RECIBIR LOS DATOS DE LOS FORMULARIOS
aplicacion.use(bodyParser.urlencoded({ extended: true }));

// ########## SE DEFINE UNA FUNCION QUE LEE TODA LA BASE DE DATOS Y DEVUELVE UN DICCIONARIO CON LA LISTA DE PELICULAS, LISTA DE PREMIOS, LISTA DE USUARIOS Y USUARIO ACTIVO (SI HAY).
// ESTE DICCIONARIO SE PASA COMO PARAMETRO A TODAS LAS PAGINAS, ADEMAS DE POSIBLES PARAMETROS ADICIONALES (COMO EL LISTADO DE NOTICIAS O EL DE COMENTARIOS) 

async function leerDatosComunes (){
  let listaPeliculas = [
    {
    'id':1,
    'titulo': 'titulo de prueba'
    },
  ]
  let listaUsuarios = [];
  let listaPremios = [];
  let usuarioActivo = -1;
  parametrosComunes = {'listaPeliculas':listaPeliculas, 'listaUsuarios':listaUsuarios, 'listaPremios':listaPremios, 'usuarioActivo':usuarioActivo};
  return parametrosComunes;
}

function leerComentarios (idPelicula){
  let comentarios = {};
  return comentarios;
}

function leerNoticias(){
  let noticias = {}
  return noticias;
}


// ########## SE DEFINEN LAS RUTAS. 
aplicacion.get('/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  let noticias = leerNoticias();
  res.render('portada',{'parametrosComunes':parametrosComunes, 'noticias':noticias});
})
aplicacion.get('/peliculas/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('peliculas',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/premios/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('premios',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/contacto/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('contacto',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/accesibilidad/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('accesibilidad',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/legal/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('legal',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/pelicula/:idPelicula', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  let idPelicula= req.params['idPelicula'];
  let comentarios = leerComentarios(idPelicula);
  res.render('detalles_pelicula',{'parametrosComunes':parametrosComunes, 'idPelicula':idPelicula, 'comentarios':comentarios});
})
// # Rutas especificas de registro y autenticacion
aplicacion.get('/register', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('register',{'parametrosComunes':parametrosComunes});
})
aplicacion.post('/register', async (req, res) => {
  let resultado = await client.db("ASWGrupo1").collection('usuarios').find({'email':req.body['email']}).toArray();
  if (resultado.length == 0) {
    bcrypt.hash(req.body['password'], 10, async function(err, hash) {
      let usuario = { 'nombre':req.body['nombre'], 'email':req.body['email'], 'password': hash};
      idUsuario = await client.db("ASWGrupo1").collection('usuarios').insertOne(usuario).toString()
      res.send('registrado')
    });
  }
  else {
    res.send('Email duplicado')
  }
})
aplicacion.get('/login', async (req, res) => {
  let parametrosComunes= await leerDatosComunes();
  res.render('login',{'parametrosComunes':parametrosComunes});
})
aplicacion.post('/login', async (req, res) => {
  // Procesar el login
  res.send('logeado');
})
aplicacion.post('/logout', async (req, res) => {
  // Procesar el logout
  res.send('adios');
})
aplicacion.get('/prueba', async (req, res) => { // Una ruta para ejecutar peticiones de prueba a la base de datos
  //resultado = await client.db("ASWGrupo1").collection('usuarios').drop()
  resultado = await client.db("ASWGrupo1").collection('usuarios').find({}).toArray();
  res.send(resultado);
})


// ########## SE ARRANCA EL SERVIDOR
aplicacion.listen(puerto, () => {
  console.log(`La aplicacion corre en el puerto ${puerto}`)
})
