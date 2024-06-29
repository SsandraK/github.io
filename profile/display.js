
import { fetchBoard } from "../query/fetch.js";
import { createBarChart } from "../SVG/barChart.js";
import { fetchUser } from "../query/fetch.js";

export async function displayUserName() {
    try {
        const userData = await fetchUser();
        if (userData) {
            const fullName = `${userData.firstName} ${userData.lastName}`;
            const userElement = document.getElementById('identification');
            if (userElement) {
                userElement.textContent = fullName;
            } else {
                console.error('Element with id "identification" not found');
            }
        }
    } catch (error) {
        console.error('Error displaying user name:', error);
    }
}

//UserInfo
export async function displayUserInfo() {
    const clickableContainer = document.getElementById('clickable-container');
    if (!clickableContainer) {
        console.error('Element with id "clickable-container" not found');
        return;
    }

    clickableContainer.addEventListener('click', async function (event) {
        event.preventDefault();
        clickableContainer.classList.toggle('rotated');

        try {
            const info = await fetchUser();
            if (info) {
                const user = info.login;
                const attrs = typeof info.attrs === 'string' ? JSON.parse(info.attrs) : info.attrs;
                const tel = attrs.tel;
                const email = attrs.email;
                const country = attrs.country;
                const city = attrs.addressCity;


                const userInfoContainer = document.getElementById('user-info');
                if (userInfoContainer) {
                    userInfoContainer.innerHTML = `
                        <p><strong>User: ${user}</p>
                              <p><strong>Tel: ${tel}</p>
                        <p><strong>Email: ${email}</p>
                        <p><strong>Country: ${country}</p>
                        <p><strong>City: ${city}</p>
                    `;
                }
            } else {
                console.error("Error: No user information found.");
            }
        } catch (error) {
            console.error("Error in displayUserInfo function:", error);
        }
    });
}

export async function displayXpAmount(cx, cy, auditRatio) {

    const clickableContainer = document.getElementById('audit-clickable-container');
    if (!clickableContainer) {
        console.error('Element with id "audit-clickable-container" not found');
        return;
    }

    try {
        const svgElement = document.getElementById('svg');
        if (!svgElement) {
            console.error('SVG element not found');
            return;
        }

        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", cx);
        textElement.setAttribute("y", cy);
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("dominant-baseline", "middle");
        textElement.setAttribute("fill", "white");
        textElement.setAttribute("font-size", "24px");
        textElement.textContent = `Audit Ratio: ${auditRatio}`;

        svgElement.appendChild(textElement);
    } catch (error) {
        console.error('Error displaying audit ratio:', error);
    }
}


const parseDate = dateString => {
    if (!dateString) {
        return new Date(NaN);
    }

    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
        const isoDateString = dateString.replace(' ', 'T') + 'Z';
        const fallbackDate = new Date(isoDateString);
        return fallbackDate;
    }
    return parsedDate;
};



export async function div01Chart() {
    const data = await fetchBoard();
    if (!data) return;

    const divPaths = data.transactions.filter(transaction =>
        !transaction.path.includes('/piscine-js/') &&
        !transaction.path.includes('/piscine-go/')
    );

    const modifiedPaths = divPaths.map(transaction => {
        const strippedPath = transaction.path.replace('/johvi/div-01/', '');
        const shortName = strippedPath.split('/').pop().substring(0, 10) + (strippedPath.length > 10 ? '...' : '');
        const createdAt = parseDate(transaction.createdAt);
        return {
            ...transaction,
            path: strippedPath,
            shortName: shortName,
            createdAt: createdAt,
        };
    });

    // Sort the modifiedPaths 
    modifiedPaths.sort((a, b) => {
        const dateA = a.createdAt.getTime();
        const dateB = b.createdAt.getTime();

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        if (a.amount < b.amount) return -1;
        if (a.amount > b.amount) return 1;

        if (a.shortName < b.shortName) return -1;
        if (a.shortName > b.shortName) return 1;

        return 0;
    });

    createBarChart('div01Chart', modifiedPaths, 'Div-01 XP');
}






