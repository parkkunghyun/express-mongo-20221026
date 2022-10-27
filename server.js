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
    
    db.collection('counter').findOne({name: 'postLength'}, (err,result)=>{
        console.log(result.totalPost)
        let totalLength = result.totalPost

        db.collection('post').insertOne({_id: totalLength+1, title:req.body.title, date: req.body.date}, ()=> {
            console.log('title date save')
            db.collection('counter').updateOne({name: 'postLength'},{$inc:{totalPost:1}},(err,count)=>{
                // set 은 오퍼레이터로 값을 완전히 변경할때 사용
                // inc 은 증가시켜주세요의 약자임 -> 1 씩 증가 , 음수도 가능
                if (err) { return console.error(err)}
            })
        })
        
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

app.delete('/delete',(req,res)=> {
    console.log(req.body) // ajax에서 보낸 data
    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne(req.body,(err,result)=> {
        if (err){ return console.error(err)}

        res.status(200).send({message: '성공'}); //응답코드 200을 보내주세요 400은 요청 잘못 500이면 서버 잘못
    })
})
