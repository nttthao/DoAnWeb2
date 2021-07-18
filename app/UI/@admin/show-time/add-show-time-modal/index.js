import React, { Component } from 'react';
import { Modal, Form, DatePicker, Select, TreeSelect } from 'antd';
import * as showTimeService from '../../../../service/show-time.service';
import * as movieService from '../../../../service/movie.service';
import { message as toastr } from 'antd';
import moment from 'moment';

export default class AddShowTimeModal extends Component {
	formRef = React.createRef();

	constructor(props) {
		super(props);
		this.state = {
			showTime: {},
			loading: true,
			movies: [],
			isMovieLoading: true,
		};

		this.handleOk = this.handleOk.bind(this);
	}

	componentDidMount() {
		movieService.getPagingListMovie(1, 99999999).then((movies) => {
			this.setState({ movies: movies.items, isMovieLoading: false });
		});
	}

	handleOk() {
		this.formRef.current.validateFields().then((showTime) => {
			const payload = {
				cinemaId: showTime.cinemaId,
				movieId: showTime.movieId,
				startAt: moment(showTime.times[0]).format('YYYY-MM-DDTHH:mm:ssZ'),
				endAt: moment(showTime.times[1]).format('YYYY-MM-DDTHH:mm:ssZ'),
			};
			showTimeService
				.createShowTime(payload)
				.then((response) => {
					toastr.success('Thêm suất chiếu thành công');
					this.props.onCloseModal(response);
					this.formRef.current.resetFields();
				})
				.catch(() => {
					toastr.error('Thêm suất chiếu thất bại');
				});
		});
	}

	render() {
		return (
			<Modal
				cancelText="Hủy"
				okText={!this.state.showTime.id ? 'Tạo' : 'Lưu'}
				title={!this.state.showTime.id ? 'Thêm suất chiếu' : 'Sửa suất chiếu'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.onCloseModal}
			>
				<Form ref={this.formRef} onFinish={this.onFinish} initialValues={this.state.showTime} {...formItemLayout}>
					<Form.Item name="cinemaId" label="Phòng chiếu" rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}>
						<TreeSelect treeData={this.props.cinemas} placeholder="Phòng chiếu" onChange={this.onChangeCinema} />
					</Form.Item>
					<Form.Item name="movieId" label="Phim" rules={[{ required: true, message: 'Vui lòng chọn phim' }]}>
						<Select loading={this.state.isMovieLoading}>
							{this.state.movies.map((movie) => (
								<Select.Option key={movie.id} value={movie.id}>
									{movie.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="times"
						label="Bắt đầu lúc"
						rules={[
							{
								type: 'array',
								required: true,
								message: 'Vui lòng chọn thời gian',
							},
						]}
					>
						<DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" />
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 5 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 19 },
	},
};
