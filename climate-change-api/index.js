const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

app.get('/', (req, res) =>{
    res.json("welcome to my Climet News API")
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))