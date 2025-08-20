const express = require("express");
const methodOverride = require("method-override");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Enable PUT & DELETE from forms
app.use(methodOverride("_method"));

let tasks = [];
let idCounter = 1;

// Show tasks (with optional filter)
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

// Edit task with PUT
app.put("/edit/:id", (req, res) => {
    let task = tasks.find(t => t.id == req.params.id);
    if (task) task.text = req.body.text;
    res.redirect("/");
});

// Delete task with DELETE
app.delete("/delete/:id", (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.redirect("/");
});

// Clear all tasks
app.post("/clear-all", (req, res) => {
    tasks = [];
    res.redirect("/");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
