# YelpCamp #
This elaborate YelpCamp project builds an app that covers basic styling using HTML/CSS/ejs, middleware, error and data validation, Mongo relationships with express, Express router, cookies, flash, session, authorization/authentication, image uploads, maps/cluster maps, security, and finally deployment. 

This app is built as a part of the Web Developer Bootcamp 2021 course to demonstrate my understanding on the sections outlined as above. 

This app has been deployed on Heroku. Please visit - https://powerful-bastion-07821.herokuapp.com

## App Description ## 
This app offers the following functionalites - 

The **Home** page give you an option to view all the existing campgrounds either using the **View Campgrounds** button at the center of the page or using the **Campgrounds** option from the navbar. 

**Register** In order to add a new campground, or update/edit the campground/s that you have created, you will first need to register as a user. 

**Login** Once you have registered as a user, you may simply login. 

_Please note that you will be able to edit **only those campground/s** that you have created._

**Campgrounds using map** You may also view the existing campgrounds by clicking on the unclustered campground, and using the link to directly view the particular campground details. 

## Technologies/Tools/Services/Languages Used ##
**VS Code** - Code editor 

**Bootstrap 5** - HTML/CSS/JavaScript framework

**Morgan Logger Middleware** - Helps log HTTP request logget middleware for node.js

**EJS** - Templating tool for generating layout (using ejs-mate)

**JOI** - Javascript data validator 

**MongoDB using Mongoose** - Database 

**Passport** - Used for authentication 

**Cloudinary** - Used for images uploads

**Multer Middleware** - It is a node.js middleware used for uploading files. 

**Mapbox** - For displaying maps(uses the mapbox gl js library tool)

**Helmet** - Used for express security

**Mongo Atlas** - Cloud database service

**Heroku** - Final app deployement 

## Preferred Browser ##

Safari and Google Chrome

## Launch ##

Refer to the app.js and install the necessary npm packages in the terminal. 

Once complete, run 

_nodemon app.js_ (and pray that you do not see any errors) 

It should display a message as below - 

[nodemon] 2.0.6

[nodemon] to restart at any time, enter `rs`

[nodemon] watching path(s): *.*

[nodemon] watching extensions: js,mjs,json

[nodemon] starting `node app.js`

Serving on port 3000

Database connected

Open the browser (preferably Safari) and you should be able to see the YelpCamp app. 
