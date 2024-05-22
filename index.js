const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/', (req, res) => {
    res.send('<a href="/login">Log in with GitHub</a>');
});
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

app.get('/login', (req, res) => {
    const redirectUri = 'https://oauth3-virid.vercel.app/callback'; // Update with your Vercel URL
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

module.exports = app;
