export function startSession(jwtToken) {
    try {
        localStorage.setItem('jwtToken', JSON.stringify(jwtToken));
        console.log('Session started successfully');
    } catch (error) {
        console.error('Error storing session data', error);
    }
}

export function isUserLoggedIn(address) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        if (address === 'profile') {
            window.location.href = 'index.html';
        }
        return false;
    }

    const parsedToken = JSON.parse(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (parsedToken.exp <= currentTime) {
        endSession();
        if (address === 'profile') {
            window.location.href = 'index.html';
        }
        return false;
    }

    return true;
}

export function endSession() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html';
}

// In login.html, check if the user is logged in and redirect to profile.html if true
export function loginTokenCheck() {
    if (isUserLoggedIn()) {
        window.location.href = 'profile.html';
    }
}
