/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import { Modal, Form, Input, Button, Upload, InputNumber, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as movieService from '../../../../service/movie.service';
import { message as toastr } from 'antd';
import { environment } from '../../../../../environments/environment';

export default class AddEditMovieModal extends Component {
	formRef = React.createRef();

	constructor(props) {
		super(props);
		this.state = {
			movie: {},
			loading: true,
		};

		this.handleOk = this.handleOk.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.movie !== this.props.movie) {
			this.setState({ movie: this.props.movie || {} });
		}
	}

	handleOk() {
		this.formRef.current.validateFields().then((movie) => {
			movieService
				.createMovie({...movie, publishAt: movie.publishAt.startOf('day')})
				.then((response) => {
					toastr.success(`${movie.id ? 'Sửa' : 'Thêm'} phim thành công`);
					this.props.onCloseModal(response);
					this.formRef.current.resetFields();
				})
				.catch(() => {
					toastr.error(`${movie.id ? 'Sửa' : 'Thêm'} phim thất bại`);
				});
		});
	}

	render() {
		return (
			<Modal cancelText="Hủy" okText={!this.state.movie.id ? 'Tạo' : 'Lưu'} title={!this.state.movie.id ? 'Thêm phim' : 'Sửa phim'} visible={this.props.visible} onOk={this.handleOk} onCancel={this.props.onCloseModal}>
				<Form ref={this.formRef} onFinish={this.onFinish} initialValues={this.state.movie} {...formItemLayout}>
					<Form.Item
						name="name"
						label="Tên phim"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="age"
						label="Độ tuổi"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<InputNumber style={{ width: '50%' }} />
					</Form.Item>
					<Form.Item
						name="duration"
						label="Thời lượng"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<InputNumber min={1} max={200} style={{ width: '50%' }} />
					</Form.Item>
					<Form.Item
						name="publishAt"
						label="Ngày phát hành"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<DatePicker style={{ width: '50%' }} />
					</Form.Item>
					<Form.Item
						name="posterUrl"
						label="Poster"
						getValueFromEvent={(e) => e.fileList[0]?.response || e}
						rules={[
							{
								required: true,
								message: 'Vui lòng điền vào giá trị này',
							},
						]}
					>
						<Upload name="poster" action={environment.BaseURL + '/files/posters'} multiple="false" maxCount={1} accept="image/*" listType="picture">
							<Button icon={<UploadOutlined />}>Click to upload</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 7 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 17 },
	},
};
