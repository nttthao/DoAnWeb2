import { environment } from '../../environments/environment';
import service from '.';

const BASE_URL = environment.BaseURL + '/api/bookings';

export function get(page = 1, size = 10) {
	return service(BASE_URL, {
		method: 'GET',
		params: { page, size },
	});
}

export function create(payload) {
	return service(BASE_URL, {
		method: 'POST',
		data: payload,
	});
}
