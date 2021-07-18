/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { message as toastr } from 'antd';
import './css/login.sass';
import { SignUp } from '../../service/auth.service';

export default class Resgister extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			userpassword: '',
			userpassword2: '',
			userphone: '',
			usergmail: '',
			redirectToReferrer: false,
		};
		this.register = this.register.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	register() {
		if (this.state.userpassword !== this.state.userpassword2) {
			toastr.error('Mật khẩu không trùng nhau.');
		} else if (this.state.userpassword && this.state.usergmail && this.state.username) {
			var model = {
				name: this.state.username,
				email: this.state.usergmail,
				password: this.state.userpassword,
			};

			SignUp(model)
				.then((res) => {
					toastr.success('Mã xác thực đã được gửi về email, vui lòng kiểm tra để hoàn tất đăng ký.');
					sessionStorage.setItem('gmail', this.state.usergmail);
					sessionStorage.setItem('type', 'registeraccount');
					this.setState({ redirectToReferrer: true });
				})
				.catch((error) => {
					var message = 'Đã xảy ra lỗi, chưa thể xác định.';
					if (error && error.response && error.response.data && error.response.data.message) {
						message = error.response.data.message;
						if (message === 'user-exist') {
							message = 'Tài khoản đã tồn tại.';
						}
					}
					toastr.error(message);
				});
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		if (this.state.redirectToReferrer) {
			return <Redirect to={'/code'} />;
		}

		return (
			<div className="ResgisterPage">
				<div id="content">
					<div class="login_wrap">
						<div class="login_inner">
							<h2 class="login_tit Lang-LBL0005">Đăng ký</h2>
							<div class="register_top">
								<section>
									<dl class="tabdl_login" id="jq-tabdl_login">
										<dd class="tab_login_con active">
											<div class="clear_fix">
												<div class="login_left">
													<ul class="etc_list">
														<li class="Lang-LBL5021">Vui lòng đăng nhập để nhận nhiều ưu đãi dành riêng cho thành viên của Lotte Cinema.</li>
													</ul>
													<div class="login_box register_box">
														<span>
															<label for="userName" class="Lang-LBL0085">
																Họ tên
															</label>
															<input onChange={this.onChange} type="text" id="userName" name="username" maxlength="20" placeholder="Nhập tên" />
														</span>
														<span>
															<label for="userEmail" class="Lang-LBL0121">
																Email
															</label>
															<input onChange={this.onChange} type="text" id="userEmail" name="usergmail" maxlength="50" placeholder="Nhập địa chỉ Email" />
														</span>
														<span>
															<label for="userPassword" class="Lang-LBL0085">
																Mật khẩu
															</label>
															<input onChange={this.onChange} type="password" id="userPassword" name="userpassword" maxlength="20" placeholder="Nhập mật khẩu" />
														</span>
														<span>
															<label for="userPassword2" class="Lang-LBL0085">
																Nhập lại mật khẩu
															</label>
															<input onChange={this.onChange} type="password" id="userPassword2" name="userpassword2" maxlength="20" placeholder="Nhập lại mật khẩu" />
														</span>
													</div>
													<div class="login_find">
														<input onClick={this.register} type="button" class="btn_login Lang-LBL0005" value="Đăng ký" id="btnMember" style={{ cursor: 'pointer' }} title="register" />
													</div>
												</div>
											</div>
										</dd>
									</dl>
								</section>
							</div>

							<div class="login_bottom">
								<p class="login_etxt Lang-LBL5022">Nếu bạn có tài khoản, bạn có thể đăng nhập!</p>
								<Link to="login">
									<a href="javascript:;" class="btn_join Lang-LBL5023" target="_blank" title="Đăng nhập" id="aMemberJoin">
										Đăng nhập tài khoản
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
