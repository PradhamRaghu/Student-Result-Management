import express from 'express';
import path from 'path';
import studentData from './data/student-data.js';

const app = express();
const port = 3000;

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.get('/dev', (req, res) => {
    res.sendFile(path.resolve('./public/about.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.resolve('./public/login.html'));
});

app.post('/login', (req, res) => {
    const { regId, password } = req.body;
    const userIndex = studentData.findIndex((student) => student.regno === regId && student.password === password);
    if (userIndex !== -1) {
        res.redirect(`/profile/${userIndex}`);
    } else {
        res.redirect('./notfound');
    }
});

app.get('/profile/:index', (req, res) => {
    const userIndex = req.params.index;
    const user = studentData[userIndex];
    let marksTableHTML = '<table><tr><th>Subject</th><th>CAT1</th><th>CAT2</th><th>FAT</th></tr>';
    for (const subject in user.marks) {
        marksTableHTML += `
            <tr>
                <td>${subject}</td>
                <td>${user.marks[subject].CAT1}</td>
                <td>${user.marks[subject].CAT2}</td>
                <td>${user.marks[subject].FAT}</td>
            </tr>
        `;
    }
    marksTableHTML += '</table>';
    const studentProfileHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Profile</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                table, th, td {
                    border: 1px solid black;
                }
                
                th, td {
                    padding: 15px;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <h1>Welcome ${user.studentName}</h1>
            <p>Registration Number: ${user.regno}</p>
            ${marksTableHTML}
        </body>
        </html>
    `;
    res.send(studentProfileHTML);
});

app.get('/notfound', (req, res) => {
    res.sendFile(path.resolve('./public/notfound.html'));
});

app.listen(port, () => {
    console.log("Server Listening on Port: http://localhost:" + port);
});
