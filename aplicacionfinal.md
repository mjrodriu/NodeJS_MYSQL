# Proyecto Aplicación con NodeJS
## script.js
``` javascript
const mysql = require ('mysql');
const express = require ('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const path = require('path');
//CREAMOS LA INSTANCIA EXPRESS
var app = express();
// PARA LEER JSON FACILITA LA VIDA CON JSON
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: true })); 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// CONEXIÓN CON LA BASE DE DATOS
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'andel',
    multipleStatements: true
    
});
// ESTO ES PARA SI HAY UN ERROR EN LA CONEXIÓN CON LA BASE DE DATOS
// QUE SAQUE UN MENSAJE
mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Conexion bbdd correcta...');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });

//PUERTO DE ESTA APLICACIÓN
const port = process.env.PORT || 8181;

// CONECTAR, CONFIGURAR EL PUERTO DEL SERVIDOR.
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/ejemplo.html'));
    //__dirname : It will resolve to your project folder.
  });

  app.get('/insertar',function(req,res){
    res.sendFile(path.join(__dirname+'/insertar.html'));
    console.log('Conexion con insertar.html');
    //__dirname : It will resolve to your project folder.
  });

  app.post('/anadirpassword', function(req,res){
    
    // guardo el valor que me llega del formulario
        var el_nombre = req.body.nombre;
    console.log (req.body.nombre);

        var la_password = req.body.password;
    console.log (req.body.password);
   // me creo una cadena que tiene el sql que voy a lanzar a la bbdd
    var sql= `INSERT PASSWORDS (usuario, password) VALUES ( '${el_nombre}', '${la_password}')`;
    console.log (sql);

    //lanzo la query
    mysqlConnection.query(sql, (err) => {
      if (!err) {
        console.log ("CREADA NUEVA CUENTA CON EXITO");
      }
      else {
        console.log ("ERROR AL CREAR NUEVA CUENTA");
      }
    })  
    res.redirect('/');
  });

//Creating GET Router to fetch all the learner details from the MySQL Database
app.post('/passwords', function(req, res) {
    var username = req.body.login;
    var password = req.body.password;
    if (username && password) {
        mysqlConnection.query('SELECT * FROM PASSWORDS WHERE usuario = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/usuario');
            } else {
                res.send('Incorrect Username and/or Password!');
            }           
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.get('/usuario', function(req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});
```
----------------------------------------------------------------------------------------------------------------------
## ejemplo.html (HTML PRINCIPAL)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Formulario</title>
<style>
    .login-form {
      width: 300px;
      margin: 0 auto;
      font-family: Tahoma, Geneva, sans-serif;
    }
    .login-form h1 {
      text-align: center;
      color: #4d4d4d;
      font-size: 24px;
      padding: 20px 0 20px 0;
    }
    .login-form input[type="password"],
    .login-form input[type="text"] {
      width: 100%;
      padding: 15px;
      border: 1px solid #dddddd;
      margin-bottom: 15px;
      box-sizing:border-box;
    }
    .login-form input[type="submit"] {
      width: 100%;
      padding: 15px;
      background-color: #535b63;
      border: 0;
      box-sizing: border-box;
      cursor: pointer;
      font-weight: bold;
      color: #ffffff;
    }
    </style>
</head>
<body>
   <div class="login-form">
     <h1>LOGIN USUARIOS</h1>
     <form action="/passwords" method="POST">
     <div>
        <label>Usuario:</label>
        <input type="text" name="login" autofocus>
        <label>Contraseña:</label>
        <input type="password" name="password">
        <br><br>
        <input type="submit" value="Enter">
     </form>
     </div>
  <div>
     ¿No tienes cuenta?
    <a href="http://localhost:8181/insertar" class="button">Crear cuenta nueva</a>
    <form action="/passwords" method="GET">
   </div>
</body>
</html>
```
-------------------------------------------------------------------------------------------
## usuario.html (crear nueva cuenta)
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Cuenta</title>
<style>
    .login-form {
      width: 300px;
      margin: 0 auto;
      font-family: Tahoma, Geneva, sans-serif;
    }
    .login-form h1 {
      text-align: center;
      color: #4d4d4d;
      font-size: 24px;
      padding: 20px 0 20px 0;
    }
    .login-form input[type="password"],
    .login-form input[type="text"] {
      width: 100%;
      padding: 15px;
      border: 1px solid #dddddd;
      margin-bottom: 15px;
      box-sizing:border-box;
    }
    .login-form input[type="submit"] {
      width: 100%;
      padding: 15px;
      background-color: #535b63;
      border: 0;
      box-sizing: border-box;
      cursor: pointer;
      font-weight: bold;
      color: #ffffff;
    }
    </style>


</head>
<body>
  <form action="/anadirpassword" method="post">
    <div class="login-form">
        <label>Nuevo Usuario:</label>
        <input class="field_class" type="text" name="nombre" autofocus>
        <label>Nueva contraseña:</label>
        <input class="field_class" type="password" name="password">
        <br><br>
        <input class="submit_class" type="submit" value="Crear">
    </div>
  </form>
</body>
</html>
```
-----------------------------------------------------------------------------------------------
