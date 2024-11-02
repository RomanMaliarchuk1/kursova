const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'Afuwolxc@1',
    database:'tournament_management',
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

module.exports = db;