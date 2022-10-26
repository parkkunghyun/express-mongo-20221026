const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.set('view engine', 'ejs') // template engine
app.use(bodyParser.urlencoded({extended:false}))

let db;

const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb+srv://rudgus1117:85Rbh5HX4FzuSiy2@cluster0.vjrxzk5.mongodb.net/?retryWrites=true&w=majority'
,(err,client)=> {
    if (err) {return console.error(err)}

    db = client.db('todoapp')
   // db.collection('post').insertOne({title: title, date: date}, (err,result)=> {
        //console.log('db save')
   // });
    app.listen(8080, ()=>{
        console.log('servier is 8080 running')
    });
})

app.get('/pet', (req,res)=> { // 내장 nextr가능인듯
    res.send('pet goods shopping site')

})
app.get('/beauty', (req,res)=> {
    res.send('beauty goods shopping site')
})
app.get('/write',(req,res)=>{
    res.sendFile(__dirname + '/write.html')
})
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.post('/add', (req,res)=> {

    res.send('전송완ryo')
    db.collection('post').insertOne({title:req.body.title, date: req.body.date}, ()=> {
        console.log('title date save')
    })
    console.log(req.body.title)
})

app.get('/list', (req,res)=> {
    db.collection('post').find().toArray((err,result)=> {
        if (err) { return console.error(err)}
        console.log(result)
        res.render('list.ejs',{posts: result})
    }); //다 찾는 방식
   
})