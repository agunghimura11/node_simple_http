import express from 'express'
import hbs from 'hbs'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

import { initDatabase, initTable, insertProduct, getProduct } from './database.js'
import {get} from 'http'

const __dirname = path.resolve()

const app = express()
const db = initDatabase()
initTable(db)

app.set('views', __dirname + '/layouts')
app.set('view engine', 'html')
app.engine('html', hbs.__express)


app.use(morgan('combined'))

app.use('/assets', express.static(__dirname + 'assets'))

app.use(bodyParser.urlencoded())

app.get('/', (req,res,next) => {
    fetch('https://jsonplaceholder.typicode.com/users/1').then(function(response){
       return response.json()
    }).then(function(user) {
        console.log('Data-', user)
    })
    
    // res.send({success:true})
})

app.get('/loop', (req,res,next) => {
    const doFetch = (url) =>fetch(url).then(result => result.json())
    let urls = [
        'https://jsonplaceholder.typicode.com/users/1',
        'https://jsonplaceholder.typicode.com/users/2',
        'https://jsonplaceholder.typicode.com/users/3',
        'https://jsonplaceholder.typicode.com/users/4',
    ]

    let promises = []

    urls.map((url) => {
        promises.push(doFetch(url))
    })

    Promise.all(promises).then(results => console.log('Hasil do fetch',results))
})
// get product list
// app.get('/product', (req,res,next) => {
//     const product = getProduct(db)
//     console.log('Product result', product) // asyncronus karena dijalankan duluan
//     res.render('product')
// })

app.get('/product', async (req,res,next) => {

    let products 
    try {
        products = await getProduct(db)
    } catch(error) {
        return next(error)
    }

    res.render('product', {products})
})

app.get('/add-product', (req,res,next) => {
    res.send(req.query)
})

app.post('/add-product', (req,res,next)=> {
 console.log('Request', req.body)
    //insert product
    insertProduct(db, req.body.name, parseInt(req.body.price), '-')

    //redirect
    res.redirect('/product')
})

app.use((err,req,res,next) => {
    res.send(err.message)
})

app.listen(8000, () => {
    console.log('App listen on port 8000')
})