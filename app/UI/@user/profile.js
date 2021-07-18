import React, { Component } from 'react';
import './css/profile.sass';
import { Tabs, Form, Input, Button, Spin, message } from 'antd';
import * as userService from '../../service/user.service';

const { TabPane } = Tabs;

export default class Profile extends Component {
	formRef = React.createRef();

	constructor(props) {
		super(props);
		this.state = {
			data: {},
			loading: true,
		};

		this.onUpdate = this.onUpdate.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
	}

	componentDidMount() {
		userService.getMyInfo().then((data) => {
			this.setState({ loading: false, data: data });
			this.formRef.current?.resetFields();
		});
	}

	onUpdate(data) {
		this.setState({ loading: true });
		userService
			.update(data)
			.then(() => {
				this.setState({ loading: false });
				message.success('Cập nhập thông tin thành công');
			})
			.catch(() => {
				this.setState({ loading: false });
				message.error('Cập nhập thông tin thất bại');
			});
	}

	onChangePassword(data) {
		this.setState({ loading: true });
		userService
			.changePassword({ oldPassword: data.oldPassword, newPassword: data.password })
			.then(() => {
				this.setState({ loading: false });
				message.success('Đổi mật khẩu thành công');
			})
			.catch((error) => {
				this.setState({ loading: false });
				if (error.message === 'wrong-old-password') {
					message.error('Mật khẩu cũ không đúng');
				} else {
					message.error('Đổi mật khẩu thất bại');
				}
			});
	}

	render() {
		return (
			<div className="ProfilePage">
				{this.state.loading && !this.state.data.id && <Spin size="large" className="w-100 mt-5 mx-auto" />}
				{this.state.data.id && (
					<div id="content">
						<div class="profile_wrap">
							<div class="profile_inner">
								<Tabs defaultActiveKey="1" type="card" size={'large'}>
									<TabPane tab="Thông tin" key="1">
										<div class="wrapper">
											<div class="change_password">
												<Form ref={this.formRef} {...formItemLayout} className="w-75" onFinish={this.onUpdate} initialValues={this.state.data}>
													<Form.Item name="email" label="Email" rules={[{ required: true }]}>
														<Input disabled />
													</Form.Item>
													<Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
														<Input />
													</Form.Item>
													<Form.Item name="phone" label="Số điện thoại">
														<Input />
													</Form.Item>
													<Button type="primary" loading={this.state.loading} htmlType="submit" className="float-right">
														Submit
													</Button>
												</Form>
											</div>
										</div>
									</TabPane>
									<TabPane tab="Đổi mặt khẩu" key="3">
										<div class="wrapper">
											<div class="change_password">
												<Form {...formItemLayout} className="w-75" onFinish={this.onChangePassword}>
													<Form.Item name="oldPassword" label="Mật khẩu cũ" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}>
														<Input.Password />
													</Form.Item>
													<Form.Item
														name="password"
														label="Mật khẩu mới"
														rules={[
															{
																required: true,
																message: 'Vui lòng nhập mật khẩu mới',
															},
														]}
														hasFeedback
													>
														<Input.Password />
													</Form.Item>

													<Form.Item
														name="confirm"
														label="Xác nhận mật khẩu"
														dependencies={['password']}
														hasFeedback
														rules={[
															{
																required: true,
																message: 'Vui lòng nhập lại mật khẩu mới',
															},
															({ getFieldValue }) => ({
																validator(_, value) {
																	if (!value || getFieldValue('password') === value) {
																		return Promise.resolve();
																	}
																	return Promise.reject(new Error('Mật khẩu mới nhập lại không giống nhau'));
																},
															}),
														]}
													>
														<Input.Password />
													</Form.Item>
													<Button type="primary" loading={this.state.loading} htmlType="submit" className="float-right">
														Submit
													</Button>
												</Form>
											</div>
										</div>
									</TabPane>
								</Tabs>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
};
