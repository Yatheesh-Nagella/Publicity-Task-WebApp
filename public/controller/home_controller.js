import { ToDoTitle } from "../model/ToDoTitle.js";
import { DEV } from "../model/constants.js";
import { currentUser } from "./firebase_auth.js";
import { addToDoItem, addToDoTitle, deleteToDoItem, getToDoItemList, updateToDoItem } from "./firestore_controler.js";
import { progressMessage } from "../view/progress_message.js"
import { buildCard, buildCardText, createToDoItemElement } from "../view/home_page.js";
import { ToDoItem } from "../model/ToDoItem.js";

// onsubmit event handler for the create form
export async function onSubmitCreateForm(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const uid = currentUser.uid;
    const timestamp = Date.now();
    const todoTitle = new ToDoTitle({ title, uid, timestamp });

    const progress = progressMessage('Creating ...');
    e.target.prepend(progress);

    let docId;
    try {
        docId = await addToDoTitle(todoTitle);
        todoTitle.set_docId(docId);
    } catch (e) {
        if (DEV) console.log('failed to create: ', e);
        alert('Failed to create:' + JSON.stringify(e));
        progress.remove();
        return;
    }
    progress.remove();

    const container = document.getElementById('todo-container');
    container.prepend(buildCard(todoTitle));
    e.target.title.value = '';
}

// onclick event handler for the expand button
export async function onClickExpandButton(e) {
    const button = e.target;
    const cardBody = button.parentElement;
    if (button.textContent == '+') {
        const cardText = cardBody.querySelector('.card-text');
        if (!cardText) {
            // read all existing todoItems
            const progress = progressMessage('Loading item list ...');
            button.parentElement.prepend(progress);
            let itemList;
            try {
                itemList = await getToDoItemList(cardBody.id, currentUser.uid);
            } catch (e) {
                if (DEV) console.log('failed to get item list', e);
                alert('Failed to get item list: ' + JSON.stringify(e));
                progress.remove();
                return;
            }
            progress.remove();
            cardBody.appendChild(buildCardText(cardBody.id, itemList));// titileDocId
        } else {
            cardText.classList.replace('d-none', 'd-block');
        }
        button.textContent = '-';
    } else {
        const cardText = cardBody.querySelector('.card-text');
        cardText.classList.replace('d-block', 'd-none');
        button.textContent = '+';
    }
}

// onkeydown event handler for the new item input
export async function onKeydownNewItemInput(e, titleDocId) {
    if (e.key != "Enter") return; // only for Enter key
    const content = e.target.value;
    const titleId = titleDocId;
    const uid = currentUser.uid;
    const timestamp = Date.now();
    const todoItem = new ToDoItem({
        titleId, uid, content, timestamp,
    });

    const progress = progressMessage('Adding item ...');
    e.target.parentElement.prepend(progress);
    try {
        const docId = await addToDoItem(todoItem);
        todoItem.set_docId(docId);
    } catch (e) {
        if (DEV) console.log('Failed to add item', e);
        alert('Failed to save ToDo Item: ' + JSON.stringify(e));
        progress.remove();
        return;
    }

    progress.remove(); 22

    const li = createToDoItemElement(todoItem);
    const cardBody = document.getElementById(e.target.id.substring(5));
    cardBody.querySelector('ul').appendChild(li);
    e.target.value = '';
}

// onclick event handler for the delete button
export function onMouseOverItem(e) {
    const span = e.currentTarget.children[0];
    const input = e.currentTarget.children[1];
    span.classList.replace('d-block', 'd-none');
    input.classList.replace('d-none', 'd-block');
}

// onmouseout event handler for the delete button
export function onMouseOutItem(e) {
    const span = e.currentTarget.children[0];
    const input = e.currentTarget.children[1];
    input.value = span.textContent; //reset if changed without save
    span.classList.replace('d-none', 'd-block');
    input.classList.replace('d-block', 'd-none');
}

// onkeydown event handler for the update input
export async function onKeyDownUpdateItem(e) {
    if (e.key != 'Enter') return;

    const li = e.target.parentElement;
    const progress = progressMessage('Updating ...');
    li.parentElement.prepend(progress);

    const content = e.target.value.trim();
    if (content.length == 0) {
        // delete the item if empty 
        try {
            await deleteToDoItem(li.id)
            li.remove();
        } catch (e) {
            if (DEV) console.log('failed to delete', e);
            alert('failed to delete: ' + JSON.stringify(e));
        }
    } else {
        // update the item 
        const update = { content };
        try {
            await updateToDoItem(li.id, update);
            const span = li.children[0];
            span.textContent = content;
            const input = li.children[1];
            input.value = content;
        } catch (e) {
            if (DEV) console.log('failed to update', e);
            alert('Failed to update: ' + JSON.stringify(e));
        }
    }

    progress.remove();
}