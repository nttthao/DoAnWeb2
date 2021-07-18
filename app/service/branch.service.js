import { environment } from '../../environments/environment';
import service from '.';

const BASE_URL = environment.BaseURL + '/api/branches';

export function get() {
	return service(BASE_URL, {
		method: 'GET',
	});
}

export function getOne(id) {
	return service(BASE_URL, {
		url: '/' + id,
		method: 'GET',
	});
}

export function createBranch(payload) {
	return service(BASE_URL, {
		method: 'POST',
		data: payload,
	});
}

export function deleteBranch(id) {
	return service(BASE_URL, {
		url: '/' + id,
		method: 'DELETE',
	});
}
