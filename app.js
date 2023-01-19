//jshint esversion:6
// храним конфиденциальную информацию в переменной окружения
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


// подключаемся к БД расположенной в MongoDB Atlas
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.DB_INFO}@cluster0.sajpizq.mongodb.net/blogDB`, (err) => {
  if (!err) {
    console.log('Successfully connected to DB.');
  }
});

// подключаемся и создаем БД
// mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://127.0.0.1:27017/blogDB', (err) => {
//   if (!err) {
//     console.log('Successfully connected to DB.');
//   }
// });

// создаем структуру документа в БД
const postSchema = new mongoose.Schema({
  postTitle : {
    type : String,
    required : true
  },
  postText : String
});

// создаем коллекцию для документов в БД
const Post = mongoose.model('post', postSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// process.env.PORT - порт, который выделит хостинг
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
})

app.get('/', (req,res)=>{
  Post.find({}, function(err, foundPosts){
    if (!err) {
      res.render('home', {
        content : homeStartingContent, 
        pagePosts : foundPosts
      }); //смотрит в папку views
    }
  })
  
});

app.get('/posts/:postId', (req,res)=>{
  Post.findById(req.params.postId, function(err, foundPost){
    res.render('post', {
      // title и text - переменные ejs в файле post.ejs
      title : foundPost.postTitle,
      text : foundPost.postText
    });;
  })
});

app.get('/about', (req,res)=>{
  res.render('about', {content : aboutContent});
});

app.get('/contact', (req,res)=>{
  res.render('contact', {content : contactContent});
});

app.get('/compose', (req,res)=>{
  res.render('compose');
});

app.post('/compose', (req,res)=>{
  const post = new Post({
    postTitle : req.body.postTitle,
    postText : req.body.postText
  });
  post.save(() => {
    // перенаправляем, только после окончания выполнения save()
    res.redirect('/'); 
  });
  
})


