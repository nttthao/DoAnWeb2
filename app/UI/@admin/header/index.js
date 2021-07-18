import React, { Component } from 'react';
import { CalendarOutlined, PoweroffOutlined, BarChartOutlined, AppstoreOutlined, ClusterOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { actUpdateStateUserLogoutRequest } from '../../../actions/actions';
import { Button } from 'antd';

class HeaderAdmin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
		};
		this.logout = this.logout.bind(this);
	}

	logout() {
		const { dispatch } = this.props;
		dispatch(actUpdateStateUserLogoutRequest());
		this.setState({ redirect: true });
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to={'/'} />;
		}
		return (
			<div>
				<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css"></link>
				<nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
					<div className="container-fluid">
						<div className="navbar-wrapper">
							<Link to="/admin/dashboard" className="text-white mr-5 mt-1">
								<h5>
									<BarChartOutlined /> Tổng quan
								</h5>
							</Link>
							<Link to="/admin/movies" className="text-white mr-5 mt-1">
								<h5>
									<AppstoreOutlined /> Kho phim
								</h5>
							</Link>
							<Link to="/admin/cinemas" className="text-white mr-5 mt-1">
								<h5>
									<ClusterOutlined /> Chi nhánh
								</h5>
							</Link>
							<Link to="/admin/show-times" className="text-white mr-5 mt-1">
								<h5>
									<CalendarOutlined /> Lịch chiếu
								</h5>
							</Link>
						</div>
						<div className="collapse navbar-collapse justify-content-end">
							<Button type="text" to="/admin/dashboard" className="text-white m-0" onClick={this.logout}>
								<h6>
									<PoweroffOutlined /> Đăng xuất
								</h6>
							</Button>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}

export default connect(function (state) {
	return { rdcUser: state.rdcUser };
})(HeaderAdmin);
