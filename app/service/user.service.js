import { environment } from '../../environments/environment';
import service from '.';

const BASE_URL = environment.BaseURL + '/api/users';

export function getMyInfo() {
	return service(BASE_URL, {
        url: '/me',
		method: 'GET',
	});
}

export function changePassword(payload) {
	return service(BASE_URL, {
        url: '/me/change-password',
		method: 'POST',
		data: payload,
	});
}

export function update(payload) {
	return service(BASE_URL, {
        url: '/me',
		method: 'PUT',
		data: payload,
	});
}
