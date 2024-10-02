const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input : process.input,
    output : process.output
});

const listName = 'TodoList';
const listFilePath = 'todolist.json';

let listItems = [];

function loadTodoList() {
    if (fs.existsSync(listFilePath)) {
        const data = fs.readFileSync(listFilePath);
        const savedData = JSON.parse(data);
        listName = savedData.listName;
        listItems = savedData.listItems;
    }
}

function saveTodoList() {
    const data = {
        listName,
        listItems
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
    loadTodoList();
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

