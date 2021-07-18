import { environment } from '../../environments/environment';
import service from '.';

const BASE_URL = environment.BaseURL + '/api/show-times';

export function get(params) {
	return service(BASE_URL, {
		method: 'GET',
		params: params,
	});
}

export function createShowTime(payload) {
	return service(BASE_URL, {
		method: 'POST',
		data: payload,
	});
}

export function deleteShowTime(id) {
	return service(BASE_URL, {
		url: '/' + id,
		method: 'DELETE',
	});
}
