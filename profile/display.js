
import { fetchBoard } from "../query/fetch.js";
import { createBarChart } from "../SVG/barChart.js";
import { fetchUser } from "../query/fetch.js";
import { createLineChart } from "../SVG/chart.js";

export async function displayUserName() {
    try {
        const userData = await fetchUser();
        if (userData) {
            const fullName = `${userData.firstName} ${userData.lastName}, ${userData.login}`;
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



export async function displayXpAmount(cx, cy, auditRatio) {
    try {
        // Create a text element to display the auditRatio in the center of the donut
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


export async function div01Chart() {
    const data = await fetchBoard();
    if (!data) return;

    // Filter transactions to exclude specific paths
    const divPaths = data.transactions.filter(transaction =>
        !transaction.path.includes('/piscine-js/') &&
        !transaction.path.includes('/piscine-go/')
    );

    // Modify data to include a shortened name property
    const modifiedPaths = divPaths.map(path => {
        const strippedPath = path.path.replace('/johvi/div-01/', ''); // Adjust as needed
        const shortName = strippedPath.split('/').pop().substring(0, 10) + (strippedPath.length > 10 ? '...' : '');
        return {
            ...path,
            path: strippedPath,
            shortName: shortName,
            amount: path.amount // Assuming `amount` is the XP
        };
    });

    createBarChart('div01Chart', modifiedPaths, 'Div-01 XP');
}




export async function piscineJS() {
    const data = await fetchBoard();
    if (!data) return;
    const piscineGoPaths = data.transactions.filter(transaction => transaction.path.includes('/piscine-js'));
    createLineChart('piscineJsChart', piscineJsPaths, 'Piscine JS XP');
}


export async function piscineGo() {
    const data = await fetchBoard();
    if (!data) return;

    const piscineGoPaths = data.transactions.filter(
        transaction => transaction.path.includes('/piscine-go')
    );

    // Modify data to include a shortened name property and strip the beginning of the path
    const modifiedPaths = piscineGoPaths.map(path => {
        const strippedPath = path.path.replace('/johvi/piscine-go', ''); // Strip out the beginning part
        const shortName = strippedPath.split('/').pop().substring(0, 10) + (strippedPath.length > 10 ? '...' : ''); // Shorten the name
        return {
            ...path,
            path: strippedPath,
            shortName: shortName
        };
    });

    createBarChart('piscineGoChart', modifiedPaths, 'Piscine Go XP');
}
