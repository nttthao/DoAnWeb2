import { environment } from "../../environments/environment";
import axios from 'axios';
import service from ".";

const BASE_URL = environment.BaseURL + '/api/auth';

export function SignIn(data) {    
	return service(BASE_URL, {
        url: '/sign-in',
		method: 'POST',
		data: data,
	});
}

export function SignUp(data) {
    return axios.post(`${BASE_URL}/sign-up`, data);
}

export function verifyNewAccount(data) {
    return axios.post(`${BASE_URL}/verify`, data);
}

export function forgetPassword(data) {
    return axios.post(`${BASE_URL}/forgot-password`, data);
}

export function checkForgotPasswordCode(data) {
    return axios.post(`${BASE_URL}/check-activation-code`, data);
}

export function changePassword(data) {
    return axios.post(`${BASE_URL}/change-password`, data);
}
