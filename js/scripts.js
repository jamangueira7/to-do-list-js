//Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBnt = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const toolbarDiv = document.querySelector("#toolbar");

let oldInputValue;
let idUpdate;

/*
* Status
* P - pendente
* F - Finalizado
* */

//Funções Local Storage
const localStorageTodos = JSON.parse(localStorage
    .getItem('todos'));

let todosStorage = localStorage
    .getItem('todos') !== null
    ? localStorageTodos
    : [];

const updateLocalStorage  = () => {
    localStorage.setItem('todos', JSON.stringify(todosStorage));
};

const removeTodo = id => todosStorage.filter(todo => todo.id !== Number(id));

const updateStatusLocalStore = id => {
    todosStorage.forEach((todo) => {
        if (todo.id === Number(id)) {
            todo.status = todo.status === 'P' ? 'F' : 'P';
        }
    });
    updateLocalStorage();
}

const updateDescriptionLocalStore = (id, description) => {
    todosStorage.forEach((todo) => {
        if (todo.id === Number(id)) {
            todo.description = description
        }
    });

    updateLocalStorage();
}


const filterTransaction = (status) => {
    const filterTransactions = todosStorage.filter(
        transaction => transaction.status === status
    );

    todoList.innerHTML = '';
    filterTransactions.forEach(saveTodo);
};


const searchTransaction = (description) => {
    const searchTransactions = todosStorage.filter(
        transaction => transaction.description.toLowerCase().includes(description.toLowerCase())
    );

    todoList.innerHTML = '';
    searchTransactions.forEach(saveTodo);
};

const generateID = () => Math.round(Math.random() * 1000);

const addTodo = (todoDescription, todoStatus) => {
    const todo = {
        id: Number(generateID()),
        description: todoDescription,
        status: todoStatus
    };

    todosStorage.push(todo);
};

// Funções
const saveTodo = ({ description, status, id }) => {

    if (!id) {
        addTodo(description, status);
        updateLocalStorage();

    }

    const todo = document.createElement("div");
    todo.setAttribute('data-id', id);

    todo.classList.add('todo');
    if (status !== 'P') {
        todo.classList.add( 'done');
    }

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = description;
    todo.append(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.append(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.append(editBtn);


    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.append(deleteBtn);

    todoList.appendChild(todo);
    todoInput.value = "";
    todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
    toolbarDiv.classList.toggle("hide");
};


const init = () => {
    todoList.innerHTML = '';
    todosStorage.forEach(saveTodo);
};

init();

// Eventos
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo({
            description: inputValue,
            status: 'P',
            id: null
        });
    }
})

document.addEventListener("click", (event) => {
    const targetEl = event.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        const id = parentEl.getAttribute('data-id');
        updateStatusLocalStore(id);
        parentEl.classList.toggle("done");
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        idUpdate = parentEl.getAttribute('data-id');
    }

    if (targetEl.classList.contains("remove-todo")) {
        const id = parentEl.getAttribute('data-id');
        todosStorage = removeTodo(id);
        updateLocalStorage();
        parentEl.remove();
    }
});

cancelEditBnt.addEventListener("click", (event) => {
    event.preventDefault();
    toggleForms();
    init();
});


filterSelect.addEventListener("change", (event) => {
    if(filterSelect.value === 'all') {
        init();
        return;
    }

    const statusFilter = filterSelect.value === 'done'? 'F' : 'P';
    filterTransaction(statusFilter);
});


searchBtn.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchInputValue = searchInput.value;

    if (!searchInputValue) {
        init();
        return;
    }

    searchTransaction(searchInputValue);
});

editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue) {
        updateDescriptionLocalStore(idUpdate, editInputValue);
    }

    init();
    toggleForms();
});
