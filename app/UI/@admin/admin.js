import React, { Component } from 'react';
import './assets/css/index.css';
import './assets/img/apple-icon.png';
import HeaderAdmin from './header';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './dashboard';
import Movie from './movie';
import Cinema from './cinema';
import ShowTime from './show-time';

export default class Admin extends Component {
	render() {
		const isAuthenticated = localStorage.getItem('access_token');
		if (!isAuthenticated) {
			return <Redirect to={'/login'} />;
		}
		return (
			<div>
				<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css"></link>
				<div className="wrapper">
					<div className="main-panel">
						<div className="card">
							<div className="card-header card-header-primary">
								<HeaderAdmin />
							</div>
							<div className="card-body">
								<Switch>
									<Route path="/admin/dashboard" component={Dashboard} />
									<Route path="/admin/movies" component={Movie} />
									<Route path="/admin/cinemas" component={Cinema} />
									<Route path="/admin/show-times" component={ShowTime} />
									<Redirect to="/admin/dashboard" />
								</Switch>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
