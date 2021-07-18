/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, message as toastr, Space } from 'antd';
import { actUpdateStateUserLoginRequest } from '../../actions/actions';
import { SignIn } from '../../service/auth.service';
import './css/login.sass';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			redirectToReferrer: '',
			loading: false,
		};
		this.login = this.login.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	login() {
		if (this.state.username && this.state.password) {
			const { username: email, password } = this.state;
			this.setState({ loading: true });

			SignIn({ email, password })
				.then((res) => {
					if (res) {
						localStorage.setItem('user', JSON.stringify(res));
					}

					if (res.token) {
						localStorage.setItem('access_token', res.token);
					}

					this.setState({ loading: false });
					toastr.success('Đăng nhập thành công.');

					if (res.role === 'admin') {
						this.updateUserLogin();
						this.setState({ redirectToReferrer: 'admin' });
					}

					if (res.role === 'user') {
						this.updateUserLogin();
						this.setState({ redirectToReferrer: 'user' });
					}
				})
				.catch((error) => {
					let message = 'Đăng nhập thất bại.';
					if (error?.message === 'user-not-exist') {
						message = 'Tài khoản hoặc mật khẩu không đúng.';
					}

					toastr.error(message);
					this.setState({ loading: false });
				});
		}
	}

	updateUserLogin() {
		var { dispatch } = this.props;
		dispatch(actUpdateStateUserLoginRequest());
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	render() {
		if (this.state.redirectToReferrer === 'admin') {
			return <Redirect to={'/admin'} />;
		}
		if (this.state.redirectToReferrer === 'user') {
			return <Redirect to={'/'} />;
		}

		return (
			<div className="LoginPage">
				<div id="content">
					<div class="login_wrap">
						<div class="login_inner">
							<h2 class="login_tit Lang-LBL0005">Đăng nhập</h2>
							<div class="login_top">
								<section>
									<dl class="tabdl_login" id="jq-tabdl_login">
										<dd class="tab_login_con active">
											<div class="clear_fix">
												<div class="login_left">
													<ul class="etc_list">
														<li class="Lang-LBL5021">Vui lòng đăng nhập để nhận nhiều ưu đãi dành riêng cho thành viên của Lotte Cinema.</li>
													</ul>
													<div class="login_box">
														<span>
															<label for="userId" class="Lang-LBL0121">
																Email
															</label>
															<input onChange={this.onChange} type="text" id="userId" name="username" placeholder="Vui lòng nhập địa chỉ Email" />
														</span>
														<span>
															<label for="userPassword" class="Lang-LBL0085">
																Mật khẩu
															</label>
															<input onChange={this.onChange} type="password" id="userPassword" name="password" placeholder="Vui lòng nhập mật khẩu" />
														</span>
													</div>
													<div class="login_find">
														<span>
															<label for="saveId" class="Lang-LBL5024"></label>
														</span>
														<Space>
															<Button type="button" loading={this.state.loading} onClick={this.login}>
																Đăng nhập
															</Button>
															<Link to="/forget-password">Quên mật khẩu</Link>
														</Space>
													</div>
												</div>
											</div>
										</dd>
									</dl>
								</section>
							</div>

							<div class="login_bottom">
								<p class="login_etxt Lang-LBL5022">Nếu bạn chưa có tài khoản, bạn có thể đăng ký!</p>
								<Link to="/resgister">
									<a href="#" class="btn_join Lang-LBL5023" title="Đăng kí tài khoản Đã mở cửa sổ mới" id="aMemberJoin">
										Đăng kí tài khoản
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(function (state) {
	return { rdcUser: state.rdcUser };
})(Login);
