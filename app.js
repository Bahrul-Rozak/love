const express = require('express')
const app = express()
const mysql = require('mysql2')
const port = 3000

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'love'
})

connection.connect((error) => {
    if(error){
        console.log("Gagal terhubung sayang", error)
    }else{
        console.log("Terhubung sayang...")
    }
})

