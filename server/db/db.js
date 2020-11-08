const pgp = require('pg-promise')();

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/sample_users_db'
const db = pgp(DATABASE_URL)

module.exports = db;
