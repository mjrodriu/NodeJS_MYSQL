export const PORT = process.env.PORT || 3000 //La 2ble barra me dice que por defecto 
												//coja el puerto 3000 en caso de que el puerto que de el servidor no sirva

export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_NAME = process.env.DB_NAME || 'userdb'
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD= process.env.DB_PASSWORD || ''
export const DB_PORT = process.env.DB_PORT || 3306