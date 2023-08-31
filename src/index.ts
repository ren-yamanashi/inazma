import * as mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sample',
});

connection.query('SELECT * FROM sample', (err, results) => {
  console.log(results);
});

connection.end();
