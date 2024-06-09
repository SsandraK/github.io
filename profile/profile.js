import { div01Chart } from "./display.js";
import { renderCircle } from "../SVG/audit.js";
import { setupLogout } from "../loginPage/login.js";
import { fetchAuditsRatio } from "../query/fetch.js";
import { displayUserName } from "./display.js";


document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            setupLogout();
        });
    }
});



export async function profilePage() {
    console.log('Profile page loaded')
    setupLogout();
    window.onload = displayUserName;
    fetchAuditsRatio();
    await renderCircle();
    //   await div01Chart();
    await div01Chart();


}


