import { environment } from '../../environments/environment';
import service from '.';

const BASE_URL = environment.BaseURL + '/api/cinemas';

export function deleteCinema(id) {
	return service(BASE_URL, {
		url: '/' + id,
		method: 'DELETE',
	});
}
