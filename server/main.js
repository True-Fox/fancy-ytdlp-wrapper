const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to search for videos
app.post("/search", (req, res) => {
    console.log("Search request received");
    const { keyword } = req.body;
    console.log(`search keyword: ${keyword}`);
    
    if (!keyword) {
        return res.status(400).send("Keyword is required");
    }

    exec(`yt-dlp --dump-json "ytsearch5:${keyword}"`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send("Failed to perform search");
        }

        try {
            const results = stdout.trim().split("\n").map(line => JSON.parse(line));
            console.log(results);
            const mappings = results.map(result => ({
                title: result.title,
                url: result.webpage_url
            }));

            res.json(mappings);
        } catch (parseError) {
            console.error(`JSON parse error: ${parseError}`);
            res.status(500).send("Failed to parse search results");
        }
    });
});

// Endpoint to download audio
app.post("/download", (req, res) => {
    console.log("Download request received");
    const { url } = req.body;
    console.log(url);

    if (!url) {
        return res.status(400).send("URL is required");
    }

    // Define the download path
    const outputPath = path.join(__dirname, 'downloads', '%(title)s.%(ext)s');

    // Execute yt-dlp command to download audio and save it in the "downloads" folder
    exec(`yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send("Failed to download!");
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        res.status(200).send('Download complete!');
    });
});

// Endpoint to list downloaded music files
app.get("/list-downloads", (req, res) => {
    const downloadsDir = "downloads";

    fs.readdir(downloadsDir, (err, files) => {
        if (err) {
            console.error('Error reading downloads directory:', err);
            return res.status(500).send("Failed to read downloads directory");
        }

        // Filter out only mp3 files (or other relevant formats)
        const musicFiles = files.filter(file => file.endsWith('.mp3'));
        res.json(musicFiles);
    });
});

// New endpoint to fetch audio files
app.post("/get-audio", (req, res) => {
    const { filename } = req.body;
    
    if (!filename) {
        return res.status(400).send("Filename is required");
    }

    const filePath = path.join(__dirname, 'downloads', filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
