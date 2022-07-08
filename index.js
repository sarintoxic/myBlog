const path = require('path');
const { config, engine } = require('express-edge');
const express = require('express');
const edge = require("edge.js");
const app = new express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectFlash = require("connect-flash");

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");
const storePost = require('./middleware/storePost')

config({ cache: process.env.NODE_ENV === 'production' });
app.use(connectFlash());
app.use(fileUpload());
mongoose.connect('mongodb+srv://Hiiu:Hieunguyenx24@cluster0.ozwelvg.mongodb.net/test', function (err) {
     if (err) throw err;
   console.log('DB Successfully connected');
  });
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://Hiiu:Hieunguyenx24@cluster0.ozwelvg.mongodb.net/test' })
})); 
app.use(express.static(__dirname + '/public'));
app.use(engine);
app.set('views', `${__dirname}/views`);
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/posts/store', storePost)
app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", auth, createPostController);
app.post("/posts/store", auth, storePost, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);
app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
});
 
