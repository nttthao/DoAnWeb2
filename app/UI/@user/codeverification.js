/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './css/login.sass';
import { message as toastr } from 'antd';
import * as authService from '../../service/auth.service';

export default class CodeVerification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usercode: '',
			gmail: '',
			type: null,
			redirectToReferrer: false,
			isValidFPCode: false,
		};
		this.submit = this.submit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		let gmail = sessionStorage.getItem('gmail');
		if (gmail) {
			this.setState({ gmail });
		}

		let type = sessionStorage.getItem('type'); // forgetpassword || registeraccount
		if (type) {
			this.setState({ type: type });
		}
	}

	submit() {
		if (this.state.usercode) {
			var params = {
				email: this.state.gmail,
				code: +this.state.usercode,
				password: this.state.password,
			};

			if (this.state.isValidFPCode && this.state.password !== this.state.password2) {
				toastr.error('Mật khấu mới không trùng nhau');
				return;
			}

			if (sessionStorage.getItem('type') === 'registeraccount') {
				authService
					.verifyNewAccount(params)
					.then(() => {
						toastr.success('Đăng ký thành công. Vui lòng đăng nhập để đặt vé ngay.');
						this.setState({ redirectToReferrer: true });
					})
					.catch(() => {
						toastr.error('Mã xác thực không đúng. Vui lòng thử lại.');
					});
			} else {
				if (this.state.isValidFPCode) {
					authService
						.changePassword(params)
						.then(() => {
							toastr.success('Đổi mật khẩu thành công. Vui lòng đăng nhập để đặt vé ngay.');
							this.setState({ redirectToReferrer: true });
						})
						.catch(() => {
							toastr.error('Lỗi hệ thống. Vui lòng thử lại.');
						});
				} else {
					authService
						.checkForgotPasswordCode(params)
						.then(() => {
							this.setState({ isValidFPCode: true });
						})
						.catch(() => {
							toastr.error('Mã xác thực không đúng. Vui lòng thử lại.');
						});
				}
			}
		}
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	render() {
		if (this.state.redirectToReferrer) {
			return <Redirect to={'/login'} />;
		}

		return (
			<div className="LoginPage">
				<div id="content">
					<div class="login_wrap">
						<div class="login_inner">
							<h2 class="login_tit Lang-LBL0005">Nhập mã xác minh</h2>
							<div class="login_top">
								<section>
									<dl class="tabdl_login" id="jq-tabdl_login">
										<dd class="tab_login_con active">
											<div class="clear_fix">
												<div class="login_left">
													<ul class="etc_list">
														<li class="Lang-LBL5021">Vui lòng nhập thông tin để trở thành viên của Lotte Cinema.</li>
														<li class="Lang-LBL5021">Với gmail: {this.state.gmail}</li>
													</ul>
													<div class="login_box">
														{this.state.isValidFPCode ? (
															<>
																<span>
																	<label for="userPassword" class="Lang-LBL0085">
																		Mật khẩu mới
																	</label>
																	<input onChange={this.onChange} type="password" id="userPassword" name="password" maxlength="20" placeholder="Nhập mật khẩu" />
																</span>
																<span>
																	<label for="userPassword2" class="Lang-LBL0085">
																		Nhập lại mật khẩu mới
																	</label>
																	<input onChange={this.onChange} type="password" id="userPassword2" name="password2" maxlength="20" placeholder="Nhập lại mật khẩu" />
																</span>
															</>
														) : (
															<span>
																<label for="userId" class="Lang-LBL0121">
																	Mã xác thực:
																</label>
																<input onChange={this.onChange} type="text" id="userId" name="usercode" maxlength="50" placeholder="Nhập mã code" />
															</span>
														)}
													</div>
													<div class="login_find">
														<span>
															<label for="saveId" class="Lang-LBL5024"></label>
														</span>
														<input onClick={this.submit} type="button" class="btn_login Lang-LBL0005" value="Xác nhận" id="btnMember" style={{ cursor: 'pointer' }} title="submit" />
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
