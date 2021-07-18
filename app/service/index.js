import axios from 'axios';

const createClient = (baseURL) =>
	axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`,
		},
	});

const request = (baseURL, options) => {
	const client = createClient(baseURL);

	return client(options)
		.then((response) => response?.data)
		.catch((error) => Promise.reject(error?.response?.data || error.message));
};

export default request;
