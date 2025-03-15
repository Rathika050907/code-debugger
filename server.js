const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/debug', (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required." });
    }

    let fileName, command;
    
    // Define file names and commands based on language
    switch (language) {
        case 'python':
            fileName = 'temp_script.py';
            command = `python ${fileName}`;
            break;
        case 'javascript':
            fileName = 'temp_script.js';
            command = `node ${fileName}`;
            break;
        case 'java':
            fileName = 'TempScript.java';
            command = `javac ${fileName} && java TempScript`;
            break;
        case 'c':
            fileName = 'temp_script.c';
            command = `gcc ${fileName} -o temp_script && ./temp_script`;
            break;
        default:
            return res.status(400).json({ error: "Unsupported language." });
    }

    // Write code to a temporary file
    fs.writeFile(fileName, code, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error writing file." });
        }

        // Execute the command
        exec(command, (error, stdout, stderr) => {
            // Delete temp files after execution
            fs.unlink(fileName, () => {});
            if (language === 'c') fs.unlink('temp_script', () => {});
            if (language === 'java') fs.unlink('TempScript.class', () => {});

            if (error) {
                return res.json({ result: stderr || error.message });
            }
            res.json({ result: stdout });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
