import express from 'express'
import {pool} from './db.js'
import {PORT} from './config.js'

//Creacion de la app web con express
const app = express()

// Puerto de la aplicación web
app.listen(PORT)
console.log('servidor en el puerto 3000')

app.get('/',async(req, res) =>{
	// res.send("IAW")
	const [result] = await pool.query(`SELECT * from users`)
	res.json(result)
})
app.get('/ping',async(req, res) =>{
	const result = await pool.query(`SELECT "hola maria" AS RESULT`)
	console.log(result[0])
})
app.get('/create',async(req, res) =>{
	const insertar = await pool.query(`INSERT into users (id, name) VALUES (' ', 'pablo')`)
	console.log(insertar[0])
})

