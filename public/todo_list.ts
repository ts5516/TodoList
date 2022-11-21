//todo_list.ts
class TodoListItem {
    private itemContainer: HTMLLIElement;
    private checkboxElement: HTMLDivElement;
    private contentElement: HTMLDivElement;
    private deleteButtonElement: HTMLButtonElement;
    private inputElement: HTMLInputElement;

    private _isCompleted: boolean;
    private _editable: boolean;
    private _content: string;

    constructor(content: string) {
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

    flipIsCompleted(): void {
        this._isCompleted = !this._isCompleted;

        if (this._isCompleted) {
            this.itemContainer.classList.add('checked');
            this.checkboxElement.innerText = '✔';
        } else {
            this.itemContainer.classList.remove('checked');
            this.checkboxElement.innerText = '';
        }
    }

    flipEditable(): void {
        this._editable = !this._editable;
        this.itemContainer.innerHTML = '';
        this.inputElement.textContent = this._content;

        if (this._editable) {
            this.itemContainer.appendChild(this.inputElement);
        } else {
            this.itemContainer.appendChild(this.checkboxElement);
            this.itemContainer.appendChild(this.contentElement);
            this.itemContainer.appendChild(this.deleteButtonElement);
        }
    }

    get isCompleted(): boolean { return this._isCompleted; }
    get editable(): boolean { return this._editable; }
    get content(): string { return this._content; }
    get container(): HTMLLIElement { return this.itemContainer; }

    setContent(content: string) {
        this._content = content;
        this.inputElement.value = this._content;
        this.contentElement.innerText = this._content;
    }
}

class TodoList {
    private _items: TodoListItem[] = [];

    constructor() { }

    add(item: TodoListItem | string): number {
        if (item instanceof TodoListItem) {
            return this._items.push(item);
        } else {
            const tItem = new TodoListItem(item);
            return this._items.push(tItem);
        }

    }

    remove(item: HTMLLIElement): number {
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].container === item) {
                this._items.splice(i, 1);
                return i;
            }
        }
        return -1;
    }

    flipIsCompleted(item: HTMLLIElement): void {
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].container === item) {
                this._items[i].flipIsCompleted();
            }
        }
    }

    flipEditable(item: HTMLLIElement, content: string): void {
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].container === item) {
                this._items[i].setContent(content);
                this._items[i].flipEditable();
            }
        }
    }

    get numOfLeftItems(): number {
        return this._items.filter(todo => todo.isCompleted === false).length;
    }
    get array(): Array<TodoListItem> { return this._items; }
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
        if (event.target instanceof HTMLInputElement &&
            event.target.value !== '' &&
            event.key === 'Enter') {
            eventAddListItem(event.target, page);
            render(page);
        }
    });

    page.removeCheckedItemsElement.addEventListener('click', () => {
        eventRemoveCheckedItem(page);
        render(page);
    });

    page.listElement.addEventListener('click', (event) => {
        if (event.target instanceof HTMLDivElement &&
            event.target.classList.value === 'checkbox') {
            eventCheckListItem(event.target, page);
            render(page);
        } else if (event.target instanceof HTMLButtonElement &&
            event.target.innerHTML === 'X') {
            eventDeleteListItem(event.target, page);
            render(page);
        }
    });

    page.listElement.addEventListener('dblclick', (event) => {
        if (event.target instanceof HTMLDivElement &&
            event.target.classList.value === 'todo') {
            eventEditListItem(event.target, page);
            render(page);
        }
    });

    page.listElement.addEventListener('keypress', (event) => {
        if (event.target instanceof HTMLInputElement &&
            event.target.value !== '' &&
            event.key === 'Enter') {
            eventEditListItem(event.target, page);
            render(page);
        }
    })
}

function eventRemoveCheckedItem(page: Page): void {
    for (let i = page.todoList.array.length; i--;) {
        if (page.todoList.array[i].isCompleted) {
            page.todoList.remove(page.todoList.array[i].container);
        }
    }
}

function eventAddListItem(target: HTMLInputElement, page: Page): void {
    page.todoList.add(target.value);
    page.inputElement.value = '';
}

function eventEditListItem(
    target: HTMLInputElement | HTMLDivElement, page: Page): void {
    if (target instanceof HTMLInputElement) {
        page.todoList.flipEditable(
            target.parentNode as HTMLLIElement, target.value);
    } else {
        page.todoList.flipEditable(
            target.parentNode as HTMLLIElement, target.innerText);
    }
}

function eventCheckListItem(target: HTMLDivElement, page: Page): void {
    page.todoList.flipIsCompleted(target.parentElement as HTMLLIElement);
}

function eventDeleteListItem(target: HTMLButtonElement, page: Page): void {
    page.todoList.remove(target.parentNode as HTMLLIElement);
}

function render(page: Page): void {
    page.listElement.innerHTML = '';

    page.todoList.array.forEach(todo => {
        page.listElement.appendChild(todo.container);
    });

    page.leftItemsElement.innerHTML = page.todoList.numOfLeftItems + '개 남음';
}

run();