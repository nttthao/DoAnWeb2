import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as branchService from '../../../service/branch.service';
import * as cinemaService from '../../../service/cinema.service';
import { message as toastr } from 'antd';
import AddEditCinemaModal from './add-edit-cinema-modal';

export default class Cinema extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			items: [],
			loading: true,
			modalVisible: false,
			selectedMovie: {},
		};

		this.onDeleteBranch = this.onDeleteBranch.bind(this);
		this.onDeleteCinema = this.onDeleteCinema.bind(this);
		this.onOpenModal = this.onOpenModal.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
	}

	componentDidMount() {
		branchService.get().then((data) => {
			this.setState({ data, loading: false });
			this.onMapData();
		});
	}

	onMapData() {
		const items = this.state.data.map((item) => ({
			key: item.id,
			...item,
			type: [...new Set(item.cinemas.map((item) => item.type))].join(', '),
			totalCinema: item.cinemas.length + ' phòng',
			totalSeat: item.cinemas.reduce((a, b) => a + b.horizontalSize * b.verticalSize, 0) + ' ghế',
			onDelete: () => this.onDeleteBranch(item.id),
			children: item.cinemas.map((cinema) => ({
				key: cinema.id,
				...cinema,
				totalCinema: undefined,
				totalSeat: `${cinema.horizontalSize * cinema.verticalSize} ghế (${cinema.horizontalSize}x${cinema.verticalSize})`,
				onDelete: () => this.onDeleteCinema(cinema.id),
			})),
		}));
		this.setState({ items });
	}

	onDeleteBranch(branchId) {
		Modal.confirm({
			title: 'Xóa chi nhánh?',
			icon: <ExclamationCircleOutlined />,
			okType: 'danger',
			content: 'Khi xóa chi nhánh này, tất cả dữ liệu về đặt vé liên quan tới chi nhánh này sẽ bị xóa.',
			onOk: () => {
				return new Promise((resolve, reject) => {
					branchService
						.deleteBranch(branchId)
						.then(() => {
							resolve();
							const data = this.state.data.filter((item) => item.id !== branchId);
							this.setState({ data });
							this.onMapData();
							toastr.success('Xóa chi nhánh thành công');
						})
						.catch(() => {
							reject();
							toastr.error('Xóa chi nhánh thất bại');
						});
				});
			},
		});
	}

	onDeleteCinema(cinemaId) {
		Modal.confirm({
			title: 'Xóa phòng chiếu?',
			icon: <ExclamationCircleOutlined />,
			okType: 'danger',
			content: 'Khi xóa phòng chiếu này, tất cả dữ liệu về đặt vé liên quan tới phòng chiếu này sẽ bị xóa.',
			onOk: () => {
				return new Promise((resolve, reject) => {
					cinemaService
						.deleteCinema(cinemaId)
						.then(() => {
							resolve();
							const data = this.state.data.map((item) => ({
								...item,
								cinemas: item.cinemas.filter((cinema) => cinema.id !== cinemaId),
							}));
							this.setState({ data });
							this.onMapData();
							toastr.success('Xóa phòng chiếu thành công');
						})
						.catch((err) => {
							reject();
							toastr.error('Xóa phòng chiếu thất bại');
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
			const data = [movie, ...this.state.data];
			this.setState({ data });
			this.onMapData();
		}

		this.setState({ modalVisible: false });
	}

	render() {
		const columns = [
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: 'Địa chỉ',
				dataIndex: 'address',
				key: 'address',
			},
			{
				title: 'Loại ghế',
				dataIndex: 'type',
				key: 'type',
			},
			{
				title: 'Số phòng chiếu',
				dataIndex: 'totalCinema',
				key: 'totalCinema',
			},
			{
				title: 'Sức chứa',
				dataIndex: 'totalSeat',
				key: 'totalSeat',
			},
			{
				title: 'Action',
				key: 'onDelete',
				render: (_, item) => (
					<Button danger type="link" size="small" onClick={() => item.onDelete()}>
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
				<Table pagination={{ position: ['none'] }} loading={this.state.loading} columns={columns} dataSource={this.state.items} />

				<AddEditCinemaModal visible={this.state.modalVisible} onCloseModal={this.onCloseModal} />
			</>
		);
	}
}
