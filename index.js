const express = require('express')
let ejs = require('ejs');
const aplicacion = express()
const puerto = 8000

// ########## SE DEFINE EL SISTEMA DE PLANTILLAS Y EL DIRECTORIO DONDE SE GUARDAN
aplicacion.set('view engine', 'ejs')
aplicacion.set('views', './views')

// ########## SE DEFINE UN DIRECTORIO PARA CONTENIDO ESTATICO (IMAGENES, CSS....) Y ASI SE EVITA TENER QUE CREAR RUTAS PARA TODO. Las rutas se toman con respecto a ese directorio.
aplicacion.use(express.static(__dirname + '/static'))

// ########## SE DEFINE UNA FUNCION QUE LEE TODA LA BASE DE DATOS Y DEVUELVE UN DICCIONARIO CON LA LISTA DE PELICULAS, LISTA DE PREMIOS, LISTA DE USUARIOS Y USUARIO ACTIVO (SI HAY).
// ESTE DICCIONARIO SE PASA COMO PARAMETRO A TODAS LAS PAGINAS, ADEMAS DE POSIBLES PARAMETROS ADICIONALES (COMO EL LISTADO DE NOTICIAS O EL DE COMENTARIOS) 

function leerDatosComunes (){
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
aplicacion.get('/', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  let noticias = leerNoticias();
  res.render('portada',{'parametrosComunes':parametrosComunes, 'noticias':noticias});
})
aplicacion.get('/peliculas/', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  res.render('peliculas',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/premios/', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  res.render('premios',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/contacto/', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  res.render('contacto',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/accesibilidad/', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  res.render('accesibilidad',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/legal/', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  res.render('legal',{'parametrosComunes':parametrosComunes});
})
aplicacion.get('/pelicula/:idPelicula', (req, res) => {
  let parametrosComunes=leerDatosComunes();
  let idPelicula= req.params['idPelicula'];
  let comentarios = leerComentarios(idPelicula);
  res.render('detalles_pelicula',{'parametrosComunes':parametrosComunes, 'idPelicula':idPelicula, 'comentarios':comentarios});
})

// ########## SE ARRANCA EL SERVIDOR
aplicacion.listen(puerto, () => {
  console.log(`La aplicacion corre en el puerto ${puerto}`)
})
