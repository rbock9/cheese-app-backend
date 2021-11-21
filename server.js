//////////////////////////////////
// Dependencies
/////////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT from .env, give it a default of 3001 (object destructuring)
const {PORT = 3001, DATABASE_URL} = process.env
// import express
const express = require("express")
// create the application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")


/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))


//////////////////////////////
// Models
//////////////////////////////
// the cheese schema
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
    isOwned: {type: Boolean, default: false}
}, {timestamps: true})

const Cheese = mongoose.model("Cheese", CheeseSchema)


/////////////////////////////////
//Middleware
//////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies


////////////////////////////////
// Routes
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// Cheese index route
// get request to /cheese, returns all cheeses as json
app.get("/cheese", async (req, res) => {
    try {
      // send all cheeses
      res.json(await Cheese.find({}));
    } catch (error) {
      res.status(400).json({ error });
    }
});

// Cheese create route
// post request to /cheese, uses request body to make new cheese
app.post("/cheese", async (req, res) => {
    try {
      // screate a new person
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
});

// Cheese update route
// put request /cheese/:id, updates cheese based on id with request body
app.put("/cheese/:id", async (req, res) => {
    try {
        // update a cheese
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})

// Destroy Route 
// delete request to /cheese/:id, deletes the cheese specified
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete a cheese
        res.json(await Cheese.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})

/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})