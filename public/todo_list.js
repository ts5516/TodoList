//todo_list.ts
var Todo = /** @class */ (function () {
    function Todo(content) {
        this._content = content;
        this._isCompleted = false;
        this._editable = false;
    }
    Object.defineProperty(Todo.prototype, "content", {
        get: function () { return this._content; },
        set: function (cont) { this._content = cont; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Todo.prototype, "isCompleted", {
        get: function () { return this._isCompleted; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Todo.prototype, "editable", {
        get: function () { return this._editable; },
        enumerable: false,
        configurable: true
    });
    Todo.prototype.flipIsCompleted = function () { this._isCompleted = !this._isCompleted; };
    Todo.prototype.flipEditable = function () { this._editable = !this._editable; };
    return Todo;
}());
var TodoList = /** @class */ (function () {
    function TodoList() {
        this.todos = [];
    }
    TodoList.prototype.append = function (todo) {
        if (typeof todo === 'string') {
            return this.todos.push(new Todo(todo));
        }
        else {
            return this.todos.push(todo);
        }
    };
    TodoList.prototype.remove = function (todo) {
        var index = this.todos.indexOf(todo);
        if (index > -1) {
            this.todos.splice(index, 1);
        }
    };
    Object.defineProperty(TodoList.prototype, "array", {
        get: function () { return this.todos; },
        enumerable: false,
        configurable: true
    });
    return TodoList;
}());
function run() {
    var page = initPageElement();
    addPageEventListener(page);
}
function initPageElement() {
    var inputElement = initInputElement();
    var listElement = initListElement();
    var leftItemsElement = initLeftItemsElement();
    var removeCheckedItemsElement = initRemoveCheckedItemsElement();
    var todoList = new TodoList();
    return {
        inputElement: inputElement,
        listElement: listElement,
        leftItemsElement: leftItemsElement,
        removeCheckedItemsElement: removeCheckedItemsElement,
        todoList: todoList
    };
}
function initInputElement() {
    var inputElem = document.querySelector('input');
    if (inputElem instanceof HTMLInputElement) {
        return inputElem;
    }
    else {
        return document.createElement('input');
    }
}
function initListElement() {
    var listElem = document.querySelector('ul');
    if (listElem instanceof HTMLUListElement) {
        return listElem;
    }
    else {
        return document.createElement('ul');
    }
}
function initLeftItemsElement() {
    var leftItemsElement = document.getElementById('leftTodo');
    if (leftItemsElement instanceof HTMLElement) {
        return leftItemsElement;
    }
    else {
        return document.createElement('div');
    }
}
function initRemoveCheckedItemsElement() {
    var removeCheckedItemsElement = document.getElementById('removeCheckedItem');
    if (removeCheckedItemsElement instanceof HTMLElement) {
        return removeCheckedItemsElement;
    }
    else {
        return document.createElement('button');
    }
}
function addPageEventListener(page) {
    page.inputElement.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' &&
            event.target.value !== '') {
            eventHandler(event, page);
        }
    });
    page.removeCheckedItemsElement.addEventListener('click', function (event) {
        eventRemoveCheckedItem(page);
        render(page);
    });
}
function eventRemoveCheckedItem(page) {
    for (var i = page.todoList.array.length; i--;) {
        if (page.todoList.array[i].isCompleted) {
            page.todoList.remove(page.todoList.array[i]);
        }
    }
}
function eventHandler(event, page, todo) {
    update(event, page, todo);
    render(page);
}
function update(event, page, todo) {
    if (event instanceof KeyboardEvent) {
        if (todo) {
            todo.flipEditable();
            todo.content = event.target.value;
        }
        else {
            var content = event.target.value;
            page.todoList.append(content);
            page.inputElement.value = '';
        }
    }
    else if (event instanceof MouseEvent && todo) {
        if (event.target instanceof HTMLDivElement) {
            if (event.target.className === 'checkbox') {
                todo.flipIsCompleted();
            }
            else {
                todo.flipEditable();
            }
        }
        else {
            page.todoList.remove(todo);
        }
    }
}
function render(page) {
    page.listElement.innerHTML = '';
    page.todoList.array.forEach(function (todo) {
        if (todo.editable) {
            createEditItem(page, todo);
        }
        else {
            createReadItem(page, todo);
        }
    });
    var getLeftItems = function () {
        return page.todoList.array.filter(function (todo) { return todo.isCompleted === false; });
    };
    page.leftItemsElement.innerHTML = getLeftItems().length + '개 남음';
}
function createEditItem(page, todo) {
    var listItem = document.createElement('li');
    listItem.classList.add('item');
    var inputElement = document.createElement('input');
    inputElement.value = todo.content;
    inputElement.classList.add('editInput');
    inputElement.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            eventHandler(event, page, todo);
        }
    });
    listItem.appendChild(inputElement);
    page.listElement.appendChild(listItem);
}
function createReadItem(page, todo) {
    var listItem = document.createElement('li');
    listItem.classList.add('item');
    var checkboxElement = document.createElement('div');
    checkboxElement.classList.add('checkbox');
    checkboxElement.addEventListener('click', function (event) {
        eventHandler(event, page, todo);
    });
    var todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    todoElement.innerText = todo.content;
    todoElement.addEventListener('dblclick', function (event) {
        eventHandler(event, page, todo);
    });
    var deleteButtonElement = document.createElement('button');
    deleteButtonElement.classList.add('deleteBotton');
    deleteButtonElement.innerHTML = 'X';
    deleteButtonElement.addEventListener('click', function (event) {
        eventHandler(event, page, todo);
    });
    if (todo.isCompleted) {
        listItem.classList.add('checked');
        checkboxElement.innerText = '✔';
    }
    listItem.appendChild(checkboxElement);
    listItem.appendChild(todoElement);
    listItem.appendChild(deleteButtonElement);
    page.listElement.appendChild(listItem);
}
run();
