import { environment } from '../../environments/environment';
import service from '.';

const BASE_URL = environment.BaseURL + '/api/movies';

export function getPagingListMovie(page, size, sort, showTimeFrom) {
	return service(BASE_URL, {
		method: 'GET',
		params: { page, size, sort, showTimeFrom },
	});
}

export function createMovie(payload) {
	return service(BASE_URL, {
		method: 'POST',
		data: payload,
	});
}

export function deleteMovie(movieId) {
	return service(BASE_URL, {
		url: '/' + movieId,
		method: 'DELETE',
	});
}
