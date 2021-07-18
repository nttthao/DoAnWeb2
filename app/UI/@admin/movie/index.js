import React, { Component } from 'react';
import { Table, Tag, Button, Image, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as movieService from '../../../service/movie.service';
import { SortMovieType } from '../../../constants/movie.const';
import moment from 'moment';
import { message as toastr } from 'antd';
import AddEditMovieModal from './add-edit-movie-modal';

export default class Movie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			size: 5,
			total: 0,
			items: [],
			loading: true,
			modalVisible: false,
			selectedMovie: {},
		};

		this.onChangePage = this.onChangePage.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onOpenModal = this.onOpenModal.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
	}

	componentDidMount() {
		const { page, size } = this.state;
		movieService.getPagingListMovie(page, size, SortMovieType.Name).then((data) => {
			this.setState({ ...data, loading: false });
		});
	}

	onChangePage(pagination) {
		this.setState({ loading: true });
		const { current } = pagination;
		movieService.getPagingListMovie(current, this.state.size, SortMovieType.Name).then((data) => {
			this.setState({ ...data, loading: false });
		});
	}

	onDelete(movieId) {
		Modal.confirm({
			title: 'Do you want to delete this movie?',
			icon: <ExclamationCircleOutlined />,
			okType: 'danger',
			content: 'When delete this movie, all booking history will be delete together.',
			onOk: () => {
				return new Promise((resolve, reject) => {
					movieService
						.deleteMovie(movieId)
						.then(() => {
							resolve();
							const items = this.state.items.filter((item) => item.id !== movieId);
							this.setState({ items });
							toastr.success('Xóa phim thành công');
						})
						.catch((err) => {
							reject();
							toastr.error('Xóa phim thất bại');
						});
				});
			},
		});
	}

	onOpenModal(movie) {
		this.setState({ modalVisible: true, selectedMovie: movie });
	}

	onCloseModal(movie) {
		if (movie.id) {
			this.setState({ items: [movie, ...this.state.items] });
		}

		this.setState({ modalVisible: false });
	}

	render() {
		const columns = [
			{
				title: 'Poster',
				dataIndex: 'posterUrl',
				key: 'posterUrl',
				render: (posterUrl) => (
					<Image
						width={50}
						src={posterUrl}
						preview={{
							src: posterUrl,
						}}
					/>
				),
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: 'Age',
				key: 'age',
				dataIndex: 'age',
				render: (age) => {
					let color = age > 16 ? 'geekblue' : 'green';
					if (age === 18) {
						color = 'volcano';
					}
					return (
						<Tag color={color} key={age}>
							{age}
						</Tag>
					);
				},
			},
			{
				title: 'Thời lượng',
				dataIndex: 'duration',
				key: 'duration',
				render: (text) => `${text} Phút`,
			},
			{
				title: 'Publish At',
				dataIndex: 'publishAt',
				key: 'publishAt',
				render: (publishAt) => moment(publishAt).format('MM/DD/YYYY'),
			},
			{
				title: 'Action',
				key: 'action',
				render: (_, item) => (
					<Button danger type="link" size="small" onClick={() => this.onDelete(item.id)}>
						Delete
					</Button>
				),
			},
		];

		return (
			<>
				<Button type="primary" size="small" className="float-right mb-2" icon={<PlusOutlined />} onClick={this.onOpenModal}>
					Thêm mới
				</Button>
				<Table
					loading={this.state.loading}
					columns={columns}
					dataSource={this.state.items}
					pagination={{
						current: +this.state.page,
						pageSize: +this.state.size,
						total: this.state.total,
					}}
					onChange={this.onChangePage}
				/>

				<AddEditMovieModal visible={this.state.modalVisible} onCloseModal={this.onCloseModal} />
			</>
		);
	}
}
