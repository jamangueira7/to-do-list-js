//Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBnt = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");

let oldInputValue;

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

const removeTodo = id => todosStorage.filter(todo => todo.id != id);

const updateTodoLocalStore = id => {
    todosStorage.forEach((todo) => {
        if (todo.id == id) {
            todo.status = todo.status == 'P' ? 'F' : 'P';
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

const gererateID = () => Math.round(Math.random() * 1000);

const addTodo = (todoDescription, todoStatus) => {
    const todo = {
        id: gererateID(),
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
};

const updateTodo = (editInputValue) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = editInputValue;
        }
    });
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
        updateTodoLocalStore(id);
        parentEl.classList.toggle("done");
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
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
});


filterSelect.addEventListener("change", (event) => {
    event.preventDefault();

    if(filterSelect.value === 'all') {
        init();
        return;
    }

    const statusFilter = filterSelect.value === 'done'? 'F' : 'P';
    filterTransaction(statusFilter);
});


editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});
