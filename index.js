import express from 'express'
import hbs from 'hbs'
import path from 'path'

const __dirname = path.resolve()

const app = express()

app.set('views', __dirname + '/layouts')
app.set('view engine', 'html')
app.engine('html', hbs.__express)

app.get('/', (req,res,next) => {
    res.send({success:true})
})

app.get('/', (req,res,next) => {
    res.send({success: true})
})

app.listen(8000, () => {
    console.log('App listen on port 8000')
})