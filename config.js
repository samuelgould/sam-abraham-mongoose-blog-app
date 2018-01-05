'use strict';

const DATABASE_URL = process.env.DATABASE_URL
	|| global.DATABASE_URL
	|| 'postgres://amljugeg:VKJqP8bTColCw0p5UiNiaTqN8CK4DN8W@baasu.db.elephantsql.com:5432/amljugeg';

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
  pool: { min: 0, max: 2 },
  debug: true
};

exports.PORT = process.env.PORT || 8080; 