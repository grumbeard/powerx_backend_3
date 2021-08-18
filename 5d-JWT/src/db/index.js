const { Pool } = require('pg');
const Item = require('../models/item');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = {
  ...require('./users')(pool),
};

db.initialise = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password_hash VARCHAR(100) NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      quantity INTEGER NOT NULL,
      uid INTEGER NOT NULL,
      FOREIGN KEY (uid) REFERENCES Users(id)
    )
  `);
};

db.end = async () => {
  await pool.end();
};

db.insertItem = async (item) => {
  const res = await pool.query(
    'INSERT INTO Items (name,quantity) VALUES ($1,$2) RETURNING *',
    [item.name, item.quantity]
  );
  return res.rowCount ? new Item(res.rows[0]) : null;
};

db.findAllItems = async () => {
  const res = await pool.query('SELECT * FROM Items');
  return res.rows.map((row) => new Item(row));
};

db.findItem = async (id) => {
  const res = await pool.query('SELECT * FROM Items WHERE id = $1', [id]);
  return res.rowCount ? new Item(res.rows[0]) : null;
};

db.updateItem = async (id, item) => {
  const res = await pool.query(
    'UPDATE Items SET name=$2, quantity=$3 WHERE id=$1 RETURNING *',
    [id, item.name, item.quantity]
  );
  return res.rowCount ? new Item(res.rows[0]) : null;
};

db.deleteItem = async (id) => {
  const res = await pool.query('DELETE FROM Items WHERE id=$1', [id]);
  return res.rowCount > 0;
};

module.exports = db;
