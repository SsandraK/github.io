import { auditsRatio, identification, board } from './data.js';


export async function fetchUser(jwt) {
    const token = JSON.parse(localStorage.getItem('jwtToken'), jwt);

    try {
        const info = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
            method: "POST",
            headers: {

                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ query: identification }),
        });

        const data = await info.json();
        const userData = data.data.user[0] || null;
        return userData;
    } catch (error) {
        console.log(error);
    }
}


//Audit: grade, path name
export async function fetchAuditsRatio() {
    const token = JSON.parse(localStorage.getItem('jwtToken'));

    if (!token) {
        console.error('JWT token not found in localStorage');
        return null;
    }

    try {
        const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ query: auditsRatio }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return null;
        }


        const nonNullGrades = data.data.nonNullGrades || [];
        const nullGrades = data.data.nullGrades || [];

        const seen = new Set();
        const nonNullGradesData = [];
        const nullGradesData = [];

        nonNullGrades.forEach(audit => {
            const identifier = `${audit.grade}-${audit.group.path}-${audit.group.path.id}-${audit.result?.object?.name || 'N/A'}`;
            if (!seen.has(identifier)) {
                seen.add(identifier);
                nonNullGradesData.push({
                    grade: audit.grade.toFixed(2),
                    path: audit.group.path,
                });
            }
        });

        nullGrades.forEach(audit => {
            const identifier = `null-${audit.group.path}-${audit.group.path.id}-${audit.result?.object?.name || 'N/A'}`;
            if (!seen.has(identifier)) {
                seen.add(identifier);
                nullGradesData.push({
                    grade: null,
                    path: audit.group.path,
                });
            }
        });

        console.log('Non-null grades data:', nonNullGradesData);
        console.log('Null grades data:', nullGradesData);

        return { nonNullGradesData, nullGradesData };

    } catch (error) {
        console.error('Error fetching audits ratio:', error);
        return null;
    }
}



//XP 
export async function fetchBoard() {
    const token = JSON.parse(localStorage.getItem('jwtToken'));

    if (!token) {
        console.error('JWT token not found in localStorage');
        return null;
    }

    try {
        const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ query: board }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return null;
        }

        const transactions = data.data.transaction || [];
        const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        let div01XP = 0;
        let piscineJsXP = 0;
        let piscineGoXP = 0;

        transactions.forEach(transaction => {
            const paths = transaction.path.split(',').map(path => path.trim());
            paths.forEach(path => {
                if (path.includes('/johvi/div-01/piscine-js')) {
                    piscineJsXP += transaction.amount;
                }
                if (path.includes('piscine-go')) {
                    piscineGoXP += transaction.amount;
                }
            });
        });

        div01XP = totalAmount - (piscineGoXP + piscineJsXP);

        return { transactions, totalAmount, div01XP, piscineGoXP, piscineJsXP };
    } catch (error) {
        console.error('Error fetching board data:', error);
        return null;
    }
}


