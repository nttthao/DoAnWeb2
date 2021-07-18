import { environment } from '../../environments/environment';
import service from '.';
import moment from 'moment';

const BASE_URL = environment.BaseURL + '/api/reports';

export function get(startDate = moment(), endDate = moment()) {
	return service(BASE_URL, {
		method: 'GET',
		params: { startDate, endDate },
	});
}
