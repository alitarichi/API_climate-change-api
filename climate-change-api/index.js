const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'http://www.telegraph.co.uk'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
        
            $('a:contains("climate")',html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                
                articles.push({
                    title,
                     url: newspaper.base + url,
                      source: newspaper.name
                    })
            
            })
            }) 
        })

app.get('/', (req, res) =>{
    res.json("welcome to my Climet News API")
})

app.get('/news/', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req , res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    console.log(newspaperAddress)
    
    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                
                specificArticles.push({
                    title,
                     url: newspaperBase + url,
                      source: newspaperId
                    })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`)) 