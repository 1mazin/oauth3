const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/', (req, res) => {
    res.send('<a href="/login">Log in with GitHub</a>');
});

app.get('/login', (req, res) => {
    const redirectUri = 'http://localhost:3000/callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user`;
    res.redirect(githubAuthUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
    }, {
        headers: { 'Accept': 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get('https://api.github.com/user', {
        headers: { 'Authorization': `token ${accessToken}` }
    });

    const userData = userResponse.data;
    res.send(`<h1>Hello, ${userData.login}</h1><img src="${userData.avatar_url}" alt="avatar" width="100">`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});