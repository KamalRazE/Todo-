const express = require("express");
const methodOverried = require("method-override");
var app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverried('_method'));

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Kamal:nZ8zPSnyXjuwWQSN@cluster0.zrxjueu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

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












// const express = require("express");
// const methodOverride = require("method-override");
// const app = express();

// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // Enable PUT & DELETE from forms
// app.use(methodOverride("_method"));

// let tasks = [];
// let idCounter = 1;

// // Show tasks (with optional filter)
// app.get("/", (req, res) => {
//     let filter = req.query.priority || "All";
//     let filteredTasks = (filter === "All") 
//         ? tasks 
//         : tasks.filter(t => t.priority === filter);
//     res.render("list", { tasks: filteredTasks, filter });
// });

// // Add task
// app.post("/add", (req, res) => {
//     let { text, priority } = req.body;
//     if (text.trim() === "") {
//         return res.send("<script>alert('Task cannot be empty!'); window.location='/';</script>");
//     }
//     tasks.push({ id: idCounter++, text, priority, completed: false });
//     res.redirect("/");
// });

// // Toggle complete
// app.post("/toggle/:id", (req, res) => {
//     let task = tasks.find(t => t.id == req.params.id);
//     if (task) task.completed = !task.completed;
//     res.redirect("/");
// });

// // Edit task with PUT
// app.put("/edit/:id", (req, res) => {
//     let task = tasks.find(t => t.id == req.params.id);
//     if (task) task.text = req.body.text;
//     res.redirect("/");
// });

// // Delete task with DELETE
// app.delete("/delete/:id", (req, res) => {
//     tasks = tasks.filter(t => t.id != req.params.id);
//     res.redirect("/");
// });

// // Clear all tasks
// app.post("/clear-all", (req, res) => {
//     tasks = [];
//     res.redirect("/");
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });