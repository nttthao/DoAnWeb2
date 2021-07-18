/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import { Modal, Form, Input, Divider, Space, Select, Button, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleTwoTone } from '@ant-design/icons';
import * as branchService from '../../../../service/branch.service';
import { message as toastr } from 'antd';

export default class AddEditCinemaModal extends Component {
	formRef = React.createRef();

	constructor(props) {
		super(props);
		this.state = {
			branch: {},
		};

		this.handleOk = this.handleOk.bind(this);
	}

	handleOk() {
		this.formRef.current.validateFields().then((branch) => {
			branchService
				.createBranch(branch)
				.then((response) => {
					toastr.success(`${branch.id ? 'Sửa' : 'Thêm'} chi nhánh thành công`);
					this.props.onCloseModal(response);
					this.formRef.current.resetFields();
				})
				.catch(() => {
					toastr.error(`${branch.id ? 'Sửa' : 'Thêm'} chi nhánh thất bại`);
				});
		});
	}

	render() {
		return (
			<Modal
				cancelText="Hủy"
				okText={!this.state.branch.id ? 'Tạo' : 'Lưu'}
				title={!this.state.branch.id ? 'Thêm chi nhánh' : 'Sửa chi nhánh'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.onCloseModal}
				width={1000}
			>
				<Form layout="inline" ref={this.formRef} onFinish={this.onFinish} initialValues={this.state.branch}>
					<Form.Item
						name="name"
						label="Tên chi nhánh"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<Input style={{ width: 250 }} />
					</Form.Item>
					<Form.Item
						name="address"
						label="Địa chỉ"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<Input style={{ width: 485 }} />
					</Form.Item>
					<Divider orientation="center" plain>
						Danh sách phòng chiếu
					</Divider>
					<Form.List name="cinemas">
						{(fields, { add, remove }) => (
							<>
								{fields.map((field) => (
									<Space key={field.key} align="baseline">
										<Form.Item {...field} name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']} label="Tên" rules={[{ required: true, message: '' }]}>
											<Input style={{ width: 250 }} />
										</Form.Item>
										<Form.Item {...field} label="Loại" name={[field.name, 'type']} fieldKey={[field.fieldKey, 'type']} rules={[{ required: true, message: '' }]}>
											<Select style={{ width: 80 }}>
												<Select.Option value="2D">2D</Select.Option>
												<Select.Option value="3D">3D</Select.Option>
											</Select>
										</Form.Item>
										<Form.Item {...field} label="Số ghê hàng ngang" name={[field.name, 'horizontalSize']} fieldKey={[field.fieldKey, 'horizontalSize']} rules={[{ required: true, message: '' }]}>
											<InputNumber min={1} style={{ width: 60 }} />
										</Form.Item>
										<Form.Item {...field} label="Số ghê hàng dọc" name={[field.name, 'verticalSize']} fieldKey={[field.fieldKey, 'verticalSize']} rules={[{ required: true, message: '' }]}>
											<InputNumber min={1} style={{ width: 60 }} />
										</Form.Item>
										<MinusCircleTwoTone twoToneColor="#eb2f96" className="ml-2" onClick={() => remove(field.name)} />
									</Space>
								))}

								<Form.Item className="mt-4 mx-auto">
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										Thêm phòng chiếu
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		);
	}
}
