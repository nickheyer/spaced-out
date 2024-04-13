const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 4876;

// Serve the main landing page from the public directory
app.get('/', async (req, res) => {
    try {
        const gamesPath = path.join(__dirname, 'games');
        const gameFolders = await fs.readdir(gamesPath, { withFileTypes: true });
        const games = gameFolders
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome</title>
            </head>
            <body>
                <h1>Welcome to the Game Portal</h1>
                <p>Select a game from the list:</p>
                <ul>
                    ${games.map(game => `<li><a href="/${game}">${game}</a></li>`).join('')}
                </ul>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error accessing the game directory');
    }
});

// Dynamically serve game directories
app.use('/:gameName', (req, res, next) => {
    const gameName = req.params.gameName;
    const gamePath = path.join(__dirname, 'games', gameName);
    express.static(gamePath)(req, res, next);
});

// Fallback route for handling 404
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});