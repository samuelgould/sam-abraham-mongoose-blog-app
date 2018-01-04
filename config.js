'use strict';

const DATABASE_URL = process.env.DATABASE_URL
                  ||	global.DATABASE_URL
									||	'blog-app';

exports.DATABASE = {
  client: 'pg',
  connection: {
    database: DATABASE_URL,
  },
};

exports.PORT = process.env.PORT || 8080; 