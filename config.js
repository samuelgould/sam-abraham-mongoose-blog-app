'use strict';

const DATABASE_URL = process.env.DATABASE_URL
	|| global.DATABASE_URL
	|| 'mongodb://dev:dev@ds041546.mlab.com:41546/blog-db';

exports.DATABASE_URL = DATABASE_URL;

exports.PORT = process.env.PORT || 8080; 