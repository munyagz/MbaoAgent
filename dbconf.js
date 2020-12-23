require('dotenv').config()
mysql = require('mysql')

// setup database
juakali = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB
})

mpesa_channel = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB2
  })

module.exports = {
    juakali,
    mpesa_channel
}