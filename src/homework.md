- create a repository
- initialize the repository
- node_modules, package.json, package-lock.json
- install express
- create a server
- listen to port 7777
- write request handlers for /test, /hello (are they the apis?)
- install nodemon and update scripts inside package.json
- difference between ~(tilde) and ^(caret)
- what are dependencies
- what is the use of "-g" while npm install
- shall we push package.json and package-lock.json on git or not? yes


- initialize git
- add .gitignore
- create a remote repo on github 
- push all code to remote origin
- play with routes and route extensions , /hello, /hello/2, /xyz
- order of the routes matter a lot
- install Postman app and make a workspace/collection, then test API call
- write logic to handle, get, post, patch, put, delete api calls and test them on postman
- explore routing and use of ?, +, (), * in the routes (not supported in express:5)
- use of regex in routes /a/, /.*fly$/
- reading the query params in the routes
- reading the dynamic routes

- multiple route handlers - play with the code
- next()
- next function and errors along with res.send()
- app.use("/route", rh1, [rh2, rh3], rh4, rh5)
- what is middleware? Why do we need it?
- how express JS basically handles requests behind the scene
- difference b/w app.use vs app.all
- read about http codes
- write a dummy auth middleware for admin
- write a dummy auth middleware for all user routes except /user/login
- wild card error handling using app.use("/", (err, req, res, next)) and should always write at the end

- create a free cluster on MongoDB official website (Mongo Atlas)
(conection string : mongodb+srv://shriyansh:Kolkata123456@namastenode.crklcdw.mongodb.net/)
- install mongoose library (why this?)
- Connect your application to the database "connection-url"/devTinder
- call the connectDB function and connect to the database before starting the application on 7777
- create a userSchema and User Model
- create POST /signup API to add data to database
- push some documents using API calls from postman


