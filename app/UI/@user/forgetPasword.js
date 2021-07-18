/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './css/login.sass';
import { message as toastr } from 'antd';
import { forgetPassword } from '../../service/auth.service';

export default class ForgetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usergmail: '',
			redirectToReferrer: false,
		};
		this.submit = this.submit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	submit() {
		if (this.state.usergmail) {
			var model = {
				email: this.state.usergmail,
			};

			forgetPassword(model)
				.then((res) => {
					toastr.success('Mã code đã được gửi về gmail.');
					sessionStorage.setItem('type', 'forgetpassword');
					sessionStorage.setItem('gmail', model.email);
					this.setState({ redirectToReferrer: true });
				})
				.catch((error) => {
					console.log(error);
					toastr.error('Tài khaonr không tồn tại.');
				});
		}
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	render() {
		if (this.state.redirectToReferrer === true) {
			return <Redirect to={'/code'} />;
		}

		return (
			<div className="LoginPage">
				<div id="content">
					<div class="login_wrap">
						<div class="login_inner">
							<h2 class="login_tit Lang-LBL0005">Tìm tài khoản</h2>
							<div class="login_top">
								<section>
									<dl class="tabdl_login" id="jq-tabdl_login">
										<dd class="tab_login_con active">
											<div class="clear_fix">
												<div class="login_left">
													<ul class="etc_list">
														<li class="Lang-LBL5021">Vui lòng nhập gmail của bạn.</li>
													</ul>
													<div class="login_box">
														<span>
															<label for="userId" class="Lang-LBL0121">
																Nhập gmail:
															</label>
															<input onChange={this.onChange} type="text" id="userId" name="usergmail" maxlength="50" placeholder="Nhập gmail" />
														</span>
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
