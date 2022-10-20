const express = require("express")
const res = require("express/lib/response")
const app = express()
const port = 3000;
const bodyParser = require('body-parser')
app.use(express.urlencoded({extended: true})) 

const connectionUrl = 'mongodb+srv://sojin:admin1234@cluster0.g6k5ufu.mongodb.net/?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
let db;

MongoClient.connect(connectionUrl, function(err, client) {
    if (err) {
        return console.log(err);
    }
    db = client.db('todoapp');
    app.listen(port, () => {
        console.log(`listening on ${port} 🎧`);
    });
});


app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html')
})

app.get('/write', function(req, res) {
    res.sendFile(__dirname+'/write.html')
})

app.post('/add', function(req, res) {
    res.send('전송완료 💌')
    db.collection('counter').findOne({name: '게시물 개수'}, (err, result)=>{
        let totalPost = result.totalPost;
        db.collection('post').insertOne( { _id: totalPost+1, 제목 : req.body.title, 날짜 : req.body.date } , ()=>{
            console.log('저장완료 💽')
            db.collection('counter').updateOne({name: '게시물 개수'}, {$inc:{totalPost:1}}, (err, result) => {
                if (err) {return console.log(err)};
            })
          });
    });
})

app.get('/list', function(req, res) {
    db.collection('post').find().toArray((err, result)=>{
        res.render('list.ejs', {posts: result})
    });
})