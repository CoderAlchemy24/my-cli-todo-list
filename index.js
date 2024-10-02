const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

let listName = 'listItems';
const filePath = 'listItems.json';

let listItems = [];

function loadTodos() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const savedData = JSON.parse(data);
        listName = savedData.listName;
       listItems = savedData.listItems;
    }
}

function saveTodos() {
    const data = {
        listName,
       listItems
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function newTodoList(name){
    if (name) { listName = name}
    else listName = 'Todo List';
    saveTodos();
    console.log(`${listName} létrehozva`);
}

function addTodo(task){
   listItems.push({ id:listItems.length +1, task});
    saveTodos();
    console.log(`Feladat - ${task} hozzáadva a listához`)
}

function modifyTodo(id, newTask){
    const todo =listItems.find(t => t.id === parseInt(id));
    if (todo) {
        todo.task = newTask;
        saveTodos();
        console.log(`Feladat módosítva: ${newTask}`);
    } else {
        console.log('Feladat nem található.');
    }
}

function deleteTodo(id) {
    const index =listItems.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
       listItems.splice(index, 1);
        saveTodos();
        console.log(`Feladat törölve: ${id}`);
    } else {
        console.log('Feladat nem található.');
    }
}

// 'print' parancs: Lista és feladatok megjelenítése
function printTodoList() {
    if (!listName) {
        console.log('Nincs betöltött lista.');
    } else {
        console.log(`Lista neve: ${listName}`);
        if (listItems.length === 0) {
            console.log('A lista üres.');
        } else {
            console.log('Feladatok:');
           listItems.forEach(todo => {
                console.log(`${todo.id}. ${todo.task}`);
            });
        }
    }
}


function handleCommand(input) {
    const [command, ...args] = input.trim().split(' ');

    switch (command) {
        case 'new':
            const name = args.join(' ');
            newTodoList(name);
            break;
        case 'add':
            const task = args.join(' ');
            if (task) {
                addTodo(task);
            } else {
                console.log('Feladat nem adható hozzá üresen.');
            }
            break;
        case 'modify':
            const [id, ...newTaskParts] = args;
            const newTask = newTaskParts.join(' ');
            if (id && newTask) {
                modifyTodo(id, newTask);
            } else {
                console.log('Hibás parancs, használd így: modify <id> <új feladat>');
            }
            break;
        case 'delete':
            const deleteId = args[0];
            if (deleteId) {
                deleteTodo(deleteId);
            } else {
                console.log('Hibás parancs, használd így: delete <id>');
            }
            break;
        case 'print':
            printTodoList();
            break;
        default:
            console.log('Ismeretlen parancs. Használd: new, add, modify, delete, print.');
            break;
    }
}

// Fő program
function main() {
    loadTodos();
    rl.setPrompt('> ');
    rl.prompt();
    rl.on('line', (input) => {
        handleCommand(input);
        rl.prompt();
    }).on('close', () => {
        console.log('Kilépés...');
        process.exit(0);
    });
}

main();

