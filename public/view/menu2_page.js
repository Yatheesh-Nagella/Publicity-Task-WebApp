import { root } from "./elements.js";
import { currentUser } from "../controller/firebase_auth.js";
import { protectedView } from "./protected_view.js";

// Menu2 page view
export async function Menu2PageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }
    root.innerHTML = '<h1> Menu2 Page</h1>';
}

// Import all the todoTitle and todoItem

