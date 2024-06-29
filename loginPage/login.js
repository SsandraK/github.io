import { endSession, startSession } from "../ws/session.js";

export async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const { query, creds } = credentialsQuery(username, password);
        const userCredentials = btoa(`${username}:${password}`);

        const response = await fetch("https://01.kood.tech/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${userCredentials}`,
            },
            body: JSON.stringify({ query, creds }),
        });

        if (!response.ok) {
            const errorMessage = getErrorMessage(response.status);
            showError(errorMessage);
            return;
        }

        const responseData = await response.json();
        startSession(responseData);
        console.log('Started session', startSession);
        const sessionData = localStorage.getItem('sessionData');
        console.log('Session data:', sessionData);
           window.location.href = "profile.html";
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
}

function showError(message) {
    const error = document.getElementById('error-message');
    error.innerHTML = `${message} <button id='error-btn'>OK</button>`;
    error.style.display = "block";
    document.getElementById('error-btn').addEventListener('click', () => {
        error.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
}

function credentialsQuery(username, password) {
    const creds = {
        password: password,
    };
    const query = loginQuery(username);
    return { query, creds };
}

function loginQuery(username) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const getEmail = emailRegex.test(username);
    const field = getEmail ? 'email' : 'username';

    const query = `
        mutation signin($${field}: String!, $password: String!) {
            signin(${field}: $${field}, password: $password) {
                token
            }
        }
    `;

    return query;
}

export function setupLogout() {
    const logoutbtn = document.querySelector('.logout-btn');
    if (logoutbtn) {
        logoutbtn.addEventListener('click', function (event) {
            event.preventDefault();
            endSession();
             window.location.href = 'index.html';
        });
    }
}

function getErrorMessage(status) {
    switch (status) {
        case 400:
            return "Invalid login request. Please check your credentials.";
        case 401:
            return "Invalid username or password.";
        case 404:
            return "API endpoint not found.";
        default:
            return "An error occurred during login.";
    }
}

