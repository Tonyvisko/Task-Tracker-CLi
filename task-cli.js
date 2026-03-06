#!/usr/bin/env mode


const { timingSafeEqual } = require("crypto");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

const FILE = path.join(process.cwd(), "task.json");

function loadTasks() {
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function now() {
    return new Date().toISOString();
}

function add(description) {
    const tasks = loadTasks();
    const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const time = now();

    const task = {
        id,
        description,
        status: "todo",
        createdAt: time,
        updateAt: time
    };

    tasks.push(task);
    saveTasks(tasks);

    console.log(`Tasks added successfully (ID: ${id})`);
}

function update(id, description) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return console.log("Task not found");

    task.description = description;
    task.updateAt = now();


    saveTasks(task);
    console.log("Task updated successfully");
}

function remove(id) {
    const tasks = loadTasks().filter(t => t.id != id);
    saveTasks(tasks);
    console.log("Task deleted successfully");
}

function mark(id, status) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) return console.log("Task not found!");

    task.status = status;
    task.updateAt = now();

    saveTasks(tasks);
    console.log(`Task marked as ${status}`);
}

function list(filter) {
    const tasks = loadTasks();

    tasks
        .filter(t => !filter || t.status === filter)
        .forEach(t => {
            console.log(
                `[${t.id}] ${t.description} - ${t.status}\n` +
                `   Created: ${t.createdAt}\n` +
                `   Updated: ${t.updateAt}\n`
            );
        });
}

const args = process.argv.slice(2);
const cmd = args[0];

switch (cmd) {
    case "add":
        add(args[1]);
        break;

    case "update":
        update(Number(args[1]), args[2]);
        break;

    case "delete":
        remove(args[1]);
        break;

    case "mark-in-progess":
        mark(Number(args[1]), "in-progress");
        break;

    case "mark-done":
        mark(Number(args[1]), "done");
        break;

    case "list":
        list(args[1]);
        break;

    default:
        console.log("Invalid command");
}
