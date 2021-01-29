// Please note that all the campground routes are placed under routes/campgrounds.js
// Please note that all the review routes are placed under routes/review.js 

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET)
// console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// From 'https://github.com/JacksonTian/ejs-mate'. Ejs-mate is an ejs tool for layout.
const ejsMate = require('ejs-mate');
// npm i express-session
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
// including the mongo santize and later using it - https://www.npmjs.com/package/express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');

const UserRoutes = require('./routes/user.js')
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');

// from https://www.npmjs.com/package/connect-mongo under Usage
const MongoStore = require("connect-mongo")(session)

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// 'mongodb://localhost:27017/yelp-camp'
// mongoose.connect(dbUrl, { ....... will remove all the campgrounds from my local databse, but for keeping it easy, we declare the local url under dbUrl. 
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// parse the body during a post request
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thishouldbeabettersecret';

const store = new MongoStore({
    url: dbUrl,
    secret,
    // Look up for Lazy session update for more info on this. 
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, (this breaks the code, does not treat it as logged in)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// authenticate() generates a function that is used in Passport Local Strategy

passport.serializeUser((User.serializeUser()));
// generates a function that is used by passport to serialize users into the session.
passport.deserializeUser((User.deserializeUser()));

// Setting up middleware on every request
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// REGISTER FORM

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'pallavi@gmail.com', username: 'pallavi', password: 'shoes' })
//     const newUser = await User.register(user, 'shoes');
//     res.send(newUser);
// })

// Running localhost:3000/fakeUser will yield the following : 
// { "_id": "5ff4bfcab1f96f42c639e2d9", "email": "pallavi@gmail.com", "username": "pallavi", "salt": "2a9229d400d5d2a208df81fbbc831167f6dc9c7fba5ced99ce125f39efbdc8fc", "hash": "03dfd3a5738bb1e28fffd82fffffcb5c3e7116a945f9460769d289b01784424480e7e971f5eb23419f9ec308a03152f1cfdb0d3c94cc84ff8cbf4bb0f700ba685fe1988b9d5c1d22339efe9caac1812f82ff6e86dbca6b148c681c14e7dae47e9ad4c449d11dda991b5f7f2d00dd59939808bad359fdb0105284ea39a96d2cdf56fa18447621176bd791f60d141ef4cf5a810e836bacd5354bb2c451e4a2ab0e997581e2c56815c0a496740e5d38b6c4eb93b18143d1986f68c2bdde92121f92a998bc3594546f19d4c549b5981db673df4b65a818559ebb310f6bbf281f54623088eb818cfb249c29082d2896219edee6218d644f19388e439902e23ff0819842b99fe942cd8a6476235b0aa3887ef6d4e1e7f4a6c89e7347edceeea230eb2cc10b8a6aca784983331443d244ba1ad49e43f516526e0ae6681f25562b495091b20595281c2f1ddbdf648354934c9efa2b042dad4ee3082f5ade2f36d1ccfe347f7c7b30348b29100dddb3cfbe92e49c4017e9d0e6f241f1104e42447384b8a1b3c24e6533179ed4410b1d5a5e5cc70fbf1a6d2007ce7824b2e77c0bad042dac04b340dedd668997a22e83417ce35605f950fb1f9cd89580533d308e201e75bfa576784ed4c4d11592cca0b7dbf52151c87b1b0323d99fda398fb3a4d9b17a1b8dba4c22f99dfc226da5fa47bc1d0fe661a1726c60cbf51f23c9707d1984e508", "__v": 0 }

// JOI SCHEMA VALIDATION (has been moved to the schemas.js file)
// const campgroundSchema = Joi.object({
//     campgrounds: Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().required(),
//         location: Joi.string().required(),
//         description: Joi.string().required(),
//     }).required()
// })

app.use('/', UserRoutes)
// This string is being used as a prefix in the files in the routes folder
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home.ejs')
});

// for all requests. The following will run only if there are no other matches.
app.all('*', (req, res, next) => {
    // res.send("404!!!");
    next(new ExpressError('Page not found', 404))
})

// BASIC ERROR HANDLER
app.use((err, req, res, next) => {
    const { StatusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Soemthing Went Wrong!'
    res.status(StatusCode).render('error.ejs', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
