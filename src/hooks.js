import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';

export const getSession = (request) => {
	return {
		API_URL: process.env['API_URL'],
		RECAPTCHA_KEY: process.env['RECAPTCHA_KEY'],
		TESTING: process.env['TESTING'],
		MAPBOX_KEY: process.env['MAPbOX_KEY']
	};
};

export const handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.userid = cookies.userid || uuid();

	// TODO https://github.com/sveltejs/kit/issues/1046
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	const response = await resolve(request);

	if (!cookies.userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers['set-cookie'] = cookie.serialize('userid', request.locals.userid, {
			path: '/',
			httpOnly: true
		});
	}

	return response;
};
