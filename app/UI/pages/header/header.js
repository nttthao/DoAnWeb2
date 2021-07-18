import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { actFetchUsersLoginRequest, actUpdateStateUserLogoutRequest } from '../../../actions/actions';
import * as branchService from '../../../service/branch.service';
import '../../css/header.sass';
import { connect } from 'react-redux';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isUserLogin: false,
			branches: [],
		};
		this.userLogin = this.getUserLogin.bind(this);
		this.logout = this.logout.bind(this);
	}

	componentDidMount() {
		var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
		if (user) {
			this.getUserLogin();
			this.setState({ isUserLogin: true });
		}

		branchService.get().then((branches) => {
			this.setState({ branches });
		});
	}

	getUserLogin() {
		var { dispatch } = this.props;
		dispatch(actFetchUsersLoginRequest());
	}

	logout() {
		var { dispatch } = this.props;
		dispatch(actUpdateStateUserLogoutRequest());
	}

	render() {
		const { branches } = this.state;
		return (
			<div className="HeaderPage">
				<div className="header">
					<div className="laypop">
						<div className="laypop_evtAPPqr">
							<Link className="text-bold" title="Hướng dẫn cài đặt ứng dụng Lotte Cinema App QR Code">
								Lotte Cinema APP
							</Link>
						</div>
						<div className="laypop_evtFB">
							<Link className="app" to="https://www.facebook.com" target="_blank" title="Lotte Cinema Facebook">
								Lotte Cinema Facebook
							</Link>
						</div>
					</div>

					<div class="luncher">
						<ul style={{ 'margin-right': '145px' }}>
							{this.props.rdcUser && this.props.rdcUser.token ? (
								<>
									<li>
										<Link to="/profile" class="mr-1" id="lbtnName" title={this.props.rdcUser.name} href="#">
											Thông tin tài khoản
										</Link>
									</li>
									<li>
										<Link to="/booking-histories" id="topMembership">
											Lịch sử đặt vé
										</Link>
									</li>
									<li>
										<Link to="/" id="lbtnLogout" title="Đăng xuất" href="#" onClick={this.logout}>
											Đăng xuất
										</Link>
									</li>
								</>
							) : (
								<li>
									<Link to="/login" id="lbtnLogin" title="Đăng nhập">
										Đăng nhập
									</Link>
								</li>
							)}
						</ul>
					</div>

					<div className="logo">
						<h1>
							<Link to="/">
								<img src="https://www.lottecinemavn.com/LCHS/Image/logo_main.gif" id="imgLogo" alt="LOTTE CINEMA" title="LOTTE CINEMA" />
							</Link>
						</h1>
					</div>
					<div className="gnb">
						<ul>
							<li>
								<Link to="/gift-shop" title="SHOP QUÀ TẶNG">
									SHOP QUÀ TẶNG
								</Link>
							</li>
							<li>
								<Link to="/buy-ticket" title="MUA VÉ">
									MUA VÉ
								</Link>
							</li>
							<li>
								<Link to="/film" title="PHIM">
									PHIM
								</Link>
							</li>
							<li className="showroom">
								<Link to={'/cinema/' + branches[0]?.id} title="RẠP CHIẾU PHIM">
									RẠP CHIẾU PHIM
								</Link>
								<Switch>
									<Route path="/cinema">
										<div className="depth">
											<ul>
												{branches.map((item) => (
													<li key={item.id}>
														<Link title={item.name} to={'/cinema/' + item.id} className="nonactive">
															{item.name}
														</Link>
													</li>
												))}
											</ul>
										</div>
									</Route>
								</Switch>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(function (state) {
	return { rdcUser: state.rdcUser };
})(Header);
