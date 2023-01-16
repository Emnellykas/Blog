//pakage imports

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose")

const homeStartingContent = "For all the updates on your favorite movies, Here is the place to be. Fans find information on casting and release dates along with trailers and clips of their favorite flicks. With its start dating back to 1995, we'r a trusted source for movie information. our Instagram is full of updates, like news of a “Christmas Story” sequel and first looks of cult favorite, “Hocus Pocus 2.”";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//app decleration
const app = express();

//tell express to serve up public folder and use other packages
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Admin-emnellykas:Test2525@cluster0.u1mb3os.mongodb.net/postDB", {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
  if(!err) console.log("db conneted")
  else console.log(err)
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// const posts = []


//home route
app.get("/", function(req, res){

  Post.find({}, (err, foundPosts)=>{
    if(err){
      console.log(err);
    } else {
      
      res.render("home", {Content: homeStartingContent, Eposts: foundPosts})
      
    }
  })  
})

//about route
app.get('/about', (req, res) => {

  res.render("about", {Content : aboutContent})
})

//contacts route
app.get('/contact', (req, res) => {
  
  res.render("contact", {Content: contactContent })
})

//compose route
app.get('/compose', (req, res)=> {

  res.render("compose")
})

//posts get route
app.get("/posts/:topic", (req, res) =>{

  let requestedTitle = _.lowerCase(req.params.topic)

  console.log(requestedTitle)

  Post.find({}, (err, foundPosts)=>{
    if(err){
      console.log(err);
    } else{

      console.log(foundPosts)

      foundPosts.forEach((post) => {
        let storedTitle = _.lowerCase(post.title)
        
       
        if (requestedTitle === storedTitle){

          res.render("post", {Title: post.title, Content: post.content})
      
        }
      
        
     
      })
         
    }
  })
   



})


// app.get("/posts/another-post", (req, res)=>{

//   res.render("post")
// })







//compose post route
app.post("/compose", (req, res)=>{

  // let post = {
  //   title: req.body.postTitle, 
  //   body: req.body.postBody
  // }

  // posts.push(post)

 


  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })

  newPost.save()

  res.redirect("/")
})



const port = process.env.PORT || 3000


app.listen(port, function() {
  console.log("Server started on port 3000");
});
