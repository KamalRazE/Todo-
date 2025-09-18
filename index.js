const express = require("express");
const methodOverried = require("method-override");
var app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverried('_method'));

// const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://Kamal:nZ8zPSnyXjuwWQSN@cluster0.zrxjueu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");


require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

//Schema 
// const trySchema = new mongoose.Schema({
//     name: String
// });

const trySchema = new mongoose.Schema({
    name: String,
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['Important', 'Medium', 'Low'],
        default: 'Important'
    }
});
 
//model
const item = mongoose.model("task", trySchema);

//record
const todo = new item({
    name: "Create some Videos"
});
const todo2 = new item({
    name: "Learn DSA"
});
const todo3 = new item({
    name: "Learn React"
});
const todo4 = new item({
    name : "Take a break"
});

// todo.save();
// todo2.save();
// todo3.save();
// todo4.save();

// GET REQUEST, 1st argumetn {} is for all the items in the collection, 2nd argumetn is callback function wiht two parameters error and founditems(where all the items fetched from db will be stored)
// app.get('/', function(req, res){
// item.find({},function(err,foundItems){
// if(err){
//     console.log(err);
// }
// else{
//     res.render("list",{dayej : foundItems}); //rendering list.ejs file
// }
// });
// });
// NEW MONGO 7 AFER 
app.get('/', async function(req, res) {
  try {
    const filter = req.query.priority || 'All';
    const query = filter === 'All' ? {} : { priority: filter };

    const tasks = await item.find(query);

    res.render("list", { tasks, filter });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});



app.post("/add", async function(req, res) {
    try {
        const itemName = req.body.text;         // matches form input name
        const itemPriority = req.body.priority; // matches select name

        const todo4 = new item({
            name: itemName,
            priority: itemPriority,
            completed: false   // optional default
        });

        await todo4.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add task");
    }
});


// POST request to toggle item completion
app.post("/toggle/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await item.findById(taskId);
        if (task) {
            task.completed = !task.completed;
            await task.save();
        }
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error toggling task.");
    }
});

// Edit
app.put('/edit/:id', async (req, res) => {
  console.log("Updating ID:", req.params.id);
  console.log("New text:", req.body.text);

  await item.findByIdAndUpdate(req.params.id, { name: req.body.text });
  res.redirect('/');
});


// DELETE request to delete an item
app.delete("/delete/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        await item.findByIdAndDelete(taskId);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting task.");
    }
});

// Clear
  app.post("/clear-all", async (req, res) => {
    task = await item.deleteMany({});
    res.redirect("/");
  } );


// CREATE SERVER 
app.listen(3000, function(){
    console.log("Server started at port 3000");
});