const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
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

// ########## SE USA bodyParser COMO MIDDLEWARE PARA PODER RECIBIR LOS DATOS DE LOS FORMULARIOS Y cookie-parser PARA LAS COOKIES
aplicacion.use(bodyParser.urlencoded({ extended: true }));
aplicacion.use(cookieParser())

// ########## SE GENERA UNA CLAVE ALEATORIA PARA FIRMAR LOS JWT
jwtKey = require('node:crypto').randomBytes(8).toString('hex')

// ########## SE DEFINE UNA FUNCION QUE LEE TODA LA BASE DE DATOS Y DEVUELVE UN DICCIONARIO CON LA LISTA DE PELICULAS, LISTA DE PREMIOS, LISTA DE USUARIOS Y USUARIO ACTIVO (SI HAY).
// ESTE DICCIONARIO SE PASA COMO PARAMETRO A TODAS LAS PAGINAS, ADEMAS DE POSIBLES PARAMETROS ADICIONALES (COMO EL LISTADO DE NOTICIAS O EL DE COMENTARIOS) 

function autenticarUsuario(req){
  if (req.cookies['ASWGrupo1']==null) { return -1}
  try {
    tokenData = jwt.verify(req.cookies['ASWGrupo1'], jwtKey);
    return tokenData['userId']
  }
  catch { // Clave incorrecta o token invalido
    return -1
  }

}


async function leerDatosComunes (req){
  let listaPeliculas = [
    {
    'id':1,
    'titulo': 'titulo de prueba'
    },
  ]
  let listaUsuarios = await client.db("ASWGrupo1").collection('usuarios').find({}).toArray();
  let listaPremios = [];
  let usuarioActivo = autenticarUsuario(req);
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
  let parametrosComunes= await leerDatosComunes(req);
  let noticias = leerNoticias();
  res.render('portada',{'parametrosComunes':parametrosComunes, 'noticias':noticias});
})
aplicacion.get('/peliculas/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('peliculas',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/premios/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('premios',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/contacto/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('contacto',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/accesibilidad/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('accesibilidad',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/legal/', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('legal',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/pelicula/:idPelicula', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  let idPelicula= req.params['idPelicula'];
  let comentarios = leerComentarios(idPelicula);
  res.render('detalles_pelicula',{'parametrosComunes':parametrosComunes, 'idPelicula':idPelicula, 'comentarios':comentarios});
})
// # Rutas especificas de registro y autenticacion
aplicacion.get('/register', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('register',{'parametrosComunes':parametrosComunes, 'emailDuplicado':false});
})
aplicacion.post('/register', async (req, res) => {
  // Primero se comprueba que el email no este ya registrado 
  let resultado = await client.db("ASWGrupo1").collection('usuarios').findOne({'email':req.body['email']});
  if (resultado == null) {
    // Se encripta la contraseña y se guarda
    hash = await bcrypt.hash(req.body['password'], 10)
    usuario = { 'nombre':req.body['nombre'], 'email':req.body['email'], 'password': hash};
    let resultado = await client.db("ASWGrupo1").collection('usuarios').insertOne(usuario);
    let token = jwt.sign({ 'userId': resultado.insertedId.toString()  }, jwtKey, { expiresIn: '7d'});
    res.cookie ('ASWGrupo1',token)
    res.redirect ('/')
  }
  else {
    let parametrosComunes= await leerDatosComunes(req);
    res.render('register',{'parametrosComunes':parametrosComunes, 'emailDuplicado':true});
  }
})
aplicacion.get('/login', async (req, res) => {
  let parametrosComunes= await leerDatosComunes(req);
  res.render('login',{'parametrosComunes':parametrosComunes, errorLogin:false});
})
aplicacion.post('/login', async (req, res) => {
  // Se busca el email en la base de datos de usuarios
  let resultado = await client.db("ASWGrupo1").collection('usuarios').findOne({'email':req.body['email']});
  if (resultado == null) {
    let parametrosComunes= await leerDatosComunes(req);
    res.render('login',{'parametrosComunes':parametrosComunes, errorLogin:true});
  }
  else {
    bcrypt.compare(req.body['password'], resultado['password'], async function(err, result) {
      if (result == true) {
        const token = jwt.sign({ 'userId': resultado['_id'].toString() }, jwtKey, { expiresIn: '7d'});
        res.cookie ('ASWGrupo1',token)
        res.redirect ('/')
      }
      else {
        let parametrosComunes= await leerDatosComunes(req);
        res.render('login',{'parametrosComunes':parametrosComunes, errorLogin:true});
      }
    });
  }
})
aplicacion.get('/logout', async (req, res) => {
  res.clearCookie("ASWGrupo1");
  res.redirect('/')
})
aplicacion.get('/prueba', async (req, res) => { // Una ruta para ejecutar peticiones de prueba a la base de datos. Habra que quitarla al final
  let resultado = await client.db("ASWGrupo1").collection('usuarios').find({}).toArray();
  res.send(resultado)
})


// ########## SE ARRANCA EL SERVIDOR
aplicacion.listen(puerto, () => {
  console.log(`La aplicacion corre en el puerto ${puerto}`)
})
