const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.set('view engine', 'ejs') // template engine
app.use(bodyParser.urlencoded({extended:false}))

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

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
app.get('/write',(req,res)=>{
    res.sendFile(__dirname + '/write.html')
})
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
app.get('/home',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
app.post('/add', (req,res)=> {
    res.sendFile(__dirname+ '/send.html')
    
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
// detail&

app.get('/detail/:id', (req,res)=> {
    db.collection('post').findOne({_id:parseInt(req.params.id) },(err,result)=> {
        console.log(result)

        res.render('detail.ejs', { data: result})
    })

    
})

app.get('/edit/:id', (req,res)=> {
    db.collection('post').findOne({_id: parseInt(req.params.id)},(err,result)=> {
        res.render('edit.ejs', {data: result})
    })
})
app.put('/edit', (req,res)=> {
    // /edit으로 요청하면 폼에 담긴 제목이나 날짜 데이터를 가지고 db.collection에다가 업데이트 함
    db.collection('post').updateOne({_id: parseInt(req.body.id) }, {$set: {title: req.body.title, date: req.body.date}}, 
        (err,result)=> {
            console.log('suceess')
            res.redirect('/list')
    })
})

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')

app.use(session({secret: '비밀코드',resave: true, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

// 미들웨어는 요청과 응답을 해주는데 그 사이에 동작을 하는 녀석
// session 만들때 secret이 비밀 번호다
// 
app.get('/login',(req,res)=> {
    res.render('login.ejs')
})
app.post('/login', passport.authenticate('local',{ // local방식으로 회원인증
    failureRedirect: '/fail'

}),(req,res)=> {
    // 로그인 성공페이지로 보내줘야함
    res.redirect('/')
    
})

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));