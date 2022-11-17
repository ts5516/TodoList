//todo_list.ts
class Todo {
    private _content: string;
    private _isCompleted: boolean;
    private _editable: boolean;

    constructor(content: string) {
        this._content = content;
        this._isCompleted = false;
        this._editable = false;
    }

    set content(cont) { this._content = cont; }

    get content() { return this._content; }
    get isCompleted() { return this._isCompleted; }
    get editable() { return this._editable; }

    flipIsCompleted(): void { this._isCompleted = !this._isCompleted; }
    flipEditable(): void { this._editable = !this._editable; }
}

class TodoList {
    private todos: Todo[] = [];

    constructor() { }

    append(todo: string | Todo): number {
        if (typeof todo === 'string') {
            return this.todos.push(new Todo(todo));
        } else {
            return this.todos.push(todo);
        }
    }

    remove(todo: Todo): void {
        const index = this.todos.indexOf(todo);
        if (index > -1) { this.todos.splice(index, 1); }
    }

    get array(): Array<Todo> { return this.todos; }
}

type Page = {
    inputElement: HTMLInputElement;
    listElement: HTMLUListElement;
    leftItemsElement: HTMLElement;
    removeCheckedItemsElement: HTMLElement;
    todoList: TodoList;
}

function run(): void {
    const page = initPageElement();
    addPageEventListener(page);
}

function initPageElement(): Page {
    const inputElement = initInputElement();
    const listElement = initListElement();
    const leftItemsElement = initLeftItemsElement();
    const removeCheckedItemsElement = initRemoveCheckedItemsElement();
    const todoList = new TodoList();

    return {
        inputElement, listElement, leftItemsElement,
        removeCheckedItemsElement, todoList
    };
}

function initInputElement(): HTMLInputElement {
    const inputElem = document.querySelector('input');
    if (inputElem instanceof HTMLInputElement) {
        return inputElem;
    } else {
        return document.createElement('input');
    }
}

function initListElement(): HTMLUListElement {
    const listElem = document.querySelector('ul');
    if (listElem instanceof HTMLUListElement) {
        return listElem;
    } else {
        return document.createElement('ul');
    }
}

function initLeftItemsElement(): HTMLElement {
    const leftItemsElement = document.getElementById('leftTodo');
    if (leftItemsElement instanceof HTMLElement) {
        return leftItemsElement;
    } else {
        return document.createElement('div');
    }
}

function initRemoveCheckedItemsElement(): HTMLElement {
    const removeCheckedItemsElement =
        document.getElementById('removeCheckedItem');
    if (removeCheckedItemsElement instanceof HTMLElement) {
        return removeCheckedItemsElement;
    } else {
        return document.createElement('button');
    }
}

function addPageEventListener(page: Page): void {
    page.inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' &&
            (event.target as HTMLInputElement).value !== '') {
            eventHandler(event, page);
        }
    });

    page.removeCheckedItemsElement.addEventListener('click', (event) => {
        eventRemoveCheckedItem(page);
        render(page);
    })
}

function eventRemoveCheckedItem(page: Page): void {
    for (let i = page.todoList.array.length; i--;) {
        if (page.todoList.array[i].isCompleted) {
            page.todoList.remove(page.todoList.array[i]);
        }
    }
}

function eventHandler(
    event: MouseEvent | KeyboardEvent, page: Page, todo?: Todo): void {
    update(event, page, todo);
    render(page);
}

function update(
    event: MouseEvent | KeyboardEvent, page: Page, todo?: Todo): void {
    if (event instanceof KeyboardEvent) {
        if (todo) {
            todo.flipEditable();
            todo.content = (event.target as HTMLInputElement).value;
        } else {
            const content = (event.target as HTMLInputElement).value;
            page.todoList.append(content);
            page.inputElement.value = '';
        }
    } else if (event instanceof MouseEvent && todo) {
        if (event.target instanceof HTMLDivElement) {
            if (event.target.className === 'checkbox') {
                todo.flipIsCompleted();
            } else {
                todo.flipEditable();
            }
        } else {
            page.todoList.remove(todo);
        }
    }
}

function render(page: Page): void {
    page.listElement.innerHTML = '';

    page.todoList.array.forEach(todo => {
        if (todo.editable) {
            createEditItem(page, todo);
        } else {
            createReadItem(page, todo);
        }
    });

    const getLeftItems = () => {
        return page.todoList.array.filter(todo => todo.isCompleted === false);
    }
    page.leftItemsElement.innerHTML = getLeftItems().length + '개 남음';
}

function createEditItem(page: Page, todo: Todo): void {
    const listItem = document.createElement('li');
    listItem.classList.add('item');

    const inputElement = document.createElement('input');
    inputElement.value = todo.content;
    inputElement.classList.add('editInput');
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            eventHandler(event, page, todo);
        }
    });

    listItem.appendChild(inputElement);
    page.listElement.appendChild(listItem);
}

function createReadItem(page: Page, todo: Todo): void {
    const listItem = document.createElement('li');
    listItem.classList.add('item');

    const checkboxElement = document.createElement('div');
    checkboxElement.classList.add('checkbox');
    checkboxElement.addEventListener('click', (event) => {
        eventHandler(event, page, todo);
    });

    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    todoElement.innerText = todo.content;
    todoElement.addEventListener('dblclick', (event) => {
        eventHandler(event, page, todo);
    });

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.classList.add('deleteBotton');
    deleteButtonElement.innerHTML = 'X';
    deleteButtonElement.addEventListener('click', (event) => {
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