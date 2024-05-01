// menu2_page.js

import { root } from "./elements.js";
import { currentUser } from "../controller/firebase_auth.js";
import { protectedView } from "./protected_view.js";
import { getToDoTitleList, deleteToDoTitle } from "../controller/firestore_controler.js";

// menu2 page view
export async function Menu2PageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }
    root.innerHTML = '<h1>Tasks List</h1>';
    const response = await fetch('./view/templates/title_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4');
    root.innerHTML = '';
    root.appendChild(divWrapper);

    // Import all the todoTitle
    let taskLists;
    try {
        taskLists = await getToDoTitleList(currentUser.uid);
    } catch (e) {
        console.log('Failed to get task list', e);
        alert('Failed to get task list: ' + JSON.stringify(e));
        return; // Return within the async function
    }

    const tbody = divWrapper.querySelector('tbody');
    if (taskLists.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-left fs-3" style="color: red;">No Task List found!</td>
        </tr>
        `;
    }
    else {
        for (let i = 0; i < taskLists.length; i++) {
            const taskList = taskLists[i];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${currentUser.email}</td>
                <td>${taskList.title}</td>
                <td>${new Date(taskList.timestamp).toLocaleString()}</td>
                <td><button class="delete-task-btn" data-doc-id="${taskList.docId}">Delete</button></td>
            `;
            tbody.appendChild(tr);
        }
    }

    // Add event listener for delete buttons
    const deleteButtons = divWrapper.querySelectorAll('.delete-task-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            console.log('Delete button clicked for docId:', docId);
            try {
                await deleteToDoTitle(docId);
                // Refresh the page after deletion
                Menu2PageView();
            } catch (e) {
                console.log('Failed to delete task', e);
                alert('Failed to delete task: ' + JSON.stringify(e));
            }
        });
    });
}
