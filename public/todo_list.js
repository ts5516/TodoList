//todo_list.ts
var TodoListItem = /** @class */ (function () {
    function TodoListItem(content) {
        this.itemContainer = document.createElement('li');
        this.itemContainer.classList.add('item');
        this.checkboxElement = document.createElement('div');
        this.checkboxElement.classList.add('checkbox');
        this.contentElement = document.createElement('div');
        this.contentElement.classList.add('todo');
        this.contentElement.innerText = content;
        this.deleteButtonElement = document.createElement('button');
        this.deleteButtonElement.classList.add('deleteButton');
        this.deleteButtonElement.innerHTML = 'X';
        this.inputElement = document.createElement('input');
        this.inputElement.classList.add('input');
        this.inputElement.value = content;
        this.itemContainer.appendChild(this.checkboxElement);
        this.itemContainer.appendChild(this.contentElement);
        this.itemContainer.appendChild(this.deleteButtonElement);
        this._isCompleted = false;
        this._editable = false;
        this._content = content;
    }
    TodoListItem.prototype.flipIsCompleted = function () {
        this._isCompleted = !this._isCompleted;
        if (this._isCompleted) {
            this.itemContainer.classList.add('checked');
            this.checkboxElement.innerText = '✔';
        }
        else {
            this.itemContainer.classList.remove('checked');
            this.checkboxElement.innerText = '';
        }
    };
    TodoListItem.prototype.flipEditable = function () {
        this._editable = !this._editable;
        this.itemContainer.innerHTML = '';
        this.inputElement.textContent = this._content;
        if (this._editable) {
            this.itemContainer.appendChild(this.inputElement);
        }
        else {
            this.itemContainer.appendChild(this.checkboxElement);
            this.itemContainer.appendChild(this.contentElement);
            this.itemContainer.appendChild(this.deleteButtonElement);
        }
    };
    Object.defineProperty(TodoListItem.prototype, "isCompleted", {
        get: function () { return this._isCompleted; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TodoListItem.prototype, "editable", {
        get: function () { return this._editable; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TodoListItem.prototype, "content", {
        get: function () { return this._content; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TodoListItem.prototype, "container", {
        get: function () { return this.itemContainer; },
        enumerable: false,
        configurable: true
    });
    TodoListItem.prototype.setContent = function (content) {
        this._content = content;
        this.inputElement.value = this._content;
        this.contentElement.innerText = this._content;
    };
    return TodoListItem;
}());
var TodoList = /** @class */ (function () {
    function TodoList() {
        this._items = [];
    }
    TodoList.prototype.add = function (item) {
        if (item instanceof TodoListItem) {
            return this._items.push(item);
        }
        else {
            var tItem = new TodoListItem(item);
            return this._items.push(tItem);
        }
    };
    TodoList.prototype.remove = function (item) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].container === item) {
                this._items.splice(i, 1);
                return i;
            }
        }
        return -1;
    };
    TodoList.prototype.flipIsCompleted = function (item) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].container === item) {
                this._items[i].flipIsCompleted();
            }
        }
    };
    TodoList.prototype.flipEditable = function (item, content) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].container === item) {
                this._items[i].setContent(content);
                this._items[i].flipEditable();
            }
        }
    };
    Object.defineProperty(TodoList.prototype, "numOfLeftItems", {
        get: function () {
            return this._items.filter(function (todo) { return todo.isCompleted === false; }).length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TodoList.prototype, "array", {
        get: function () { return this._items; },
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
        if (event.target instanceof HTMLInputElement &&
            event.target.value !== '' &&
            event.key === 'Enter') {
            eventAddListItem(event.target, page);
            render(page);
        }
    });
    page.removeCheckedItemsElement.addEventListener('click', function () {
        eventRemoveCheckedItem(page);
        render(page);
    });
    page.listElement.addEventListener('click', function (event) {
        if (event.target instanceof HTMLDivElement &&
            event.target.classList.value === 'checkbox') {
            eventCheckListItem(event.target, page);
            render(page);
        }
        else if (event.target instanceof HTMLButtonElement &&
            event.target.innerHTML === 'X') {
            eventDeleteListItem(event.target, page);
            render(page);
        }
    });
    page.listElement.addEventListener('dblclick', function (event) {
        if (event.target instanceof HTMLDivElement &&
            event.target.classList.value === 'todo') {
            eventEditListItem(event.target, page);
            render(page);
        }
    });
    page.listElement.addEventListener('keypress', function (event) {
        if (event.target instanceof HTMLInputElement &&
            event.target.value !== '' &&
            event.key === 'Enter') {
            eventEditListItem(event.target, page);
            render(page);
        }
    });
}
function eventRemoveCheckedItem(page) {
    for (var i = page.todoList.array.length; i--;) {
        if (page.todoList.array[i].isCompleted) {
            page.todoList.remove(page.todoList.array[i].container);
        }
    }
}
function eventAddListItem(target, page) {
    page.todoList.add(target.value);
    page.inputElement.value = '';
}
function eventEditListItem(target, page) {
    if (target instanceof HTMLInputElement) {
        page.todoList.flipEditable(target.parentNode, target.value);
    }
    else {
        page.todoList.flipEditable(target.parentNode, target.innerText);
    }
}
function eventCheckListItem(target, page) {
    page.todoList.flipIsCompleted(target.parentElement);
}
function eventDeleteListItem(target, page) {
    page.todoList.remove(target.parentNode);
}
function render(page) {
    page.listElement.innerHTML = '';
    page.todoList.array.forEach(function (todo) {
        page.listElement.appendChild(todo.container);
    });
    page.leftItemsElement.innerHTML = page.todoList.numOfLeftItems + '개 남음';
}
run();
