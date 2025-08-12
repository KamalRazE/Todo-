const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let tasks = [];
let idCounter = 1;

// Show tasks (optionally filtered)
app.get("/", (req, res) => {
    let filter = req.query.priority || "All";
    let filteredTasks = (filter === "All") 
        ? tasks 
        : tasks.filter(t => t.priority === filter);
    res.render("list", { tasks: filteredTasks, filter });
});

// Add task
app.post("/add", (req, res) => {
    let { text, priority } = req.body;
    if (text.trim() === "") {
        return res.send("<script>alert('Task cannot be empty!'); window.location='/';</script>");
    }
    tasks.push({ id: idCounter++, text, priority, completed: false });
    res.redirect("/");
});

// Toggle complete
app.post("/toggle/:id", (req, res) => {
    let task = tasks.find(t => t.id == req.params.id);
    if (task) task.completed = !task.completed;
    res.redirect("/");
});

// Edit task
app.post("/edit/:id", (req, res) => {
    let task = tasks.find(t => t.id == req.params.id);
    if (task) task.text = req.body.text;
    res.redirect("/");
});

// Delete task
app.post("/delete/:id", (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.redirect("/");
});

// Clear all tasks
app.post("/clear-all", (req, res) => {
    tasks = [];
    res.redirect("/");
});

// Filter tasks by priority
app.get("/", (req, res) => {
    let filter = req.query.priority || "All";
    let filteredTasks = (filter === "All") 
        ? tasks 
        : tasks.filter(t => t.priority === filter);
    res.render("list", { tasks: filteredTasks, filter });
});

app.listen(8000, () => console.log("Server running on port 8000"));
