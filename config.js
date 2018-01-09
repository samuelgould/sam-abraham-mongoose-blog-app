'use strict';

const DATABASE_URL = process.env.DATABASE_URL
	|| global.DATABASE_URL
	|| 'mongodb://localhost/blogDb';

exports.DATABASE_URL = DATABASE_URL;

exports.PORT = process.env.PORT || 8080; 