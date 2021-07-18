import { TreeSelect, DatePicker, Timeline, Empty, Button, Spin, Tag, Modal } from 'antd';
import React, { Component } from 'react';
import { ClockCircleOutlined, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import * as branchService from '../../../service/branch.service';
import * as showTimeService from '../../../service/show-time.service';
import moment from 'moment';
import Text from 'antd/lib/typography/Text';
import AddShowTimeModal from './add-show-time-modal';
import { message as toastr } from 'antd';

export default class ShowTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			loadCinema: true,
			showTimes: [],
			now: undefined,
			selectedCinemaId: undefined,
			selectedStartTime: undefined,
			selectedEndTime: undefined,
			modalVisible: false,
		};

		this.onChangeCinema = this.onChangeCinema.bind(this);
		this.onDateRangeChange = this.onDateRangeChange.bind(this);
		this.onOpenModal = this.onOpenModal.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	componentDidMount() {
		branchService.get().then((data) => {
			const cinemas = data.map((branch) => ({
				key: 'branch_' + branch.id,
				title: branch.name,
				selectable: false,
				children: branch.cinemas.map((cinema) => ({
					key: cinema.id,
					title: cinema.name,
					value: cinema.id,
				})),
			}));
			this.setState({ cinemas, loadCinema: false });
		});
	}

	onChangeCinema(cinemaId) {
		this.setState({ selectedCinemaId: cinemaId });
		const { selectedStartTime, selectedEndTime } = this.state;
		this.onQueryData(cinemaId, selectedStartTime, selectedEndTime);
	}

	onDateRangeChange(data) {
		const selectedStartTime = data[0].startOf('day');
		const selectedEndTime = data[1].endOf('day');
		this.setState({ selectedStartTime , selectedEndTime });
		const { selectedCinemaId } = this.state;
		this.onQueryData(selectedCinemaId, selectedStartTime, selectedEndTime);
	}

	onQueryData(cinemaId, startTime, endTime) {
		if (cinemaId && startTime && endTime) {
			const params = {
				cinemaId,
				startTime: moment(startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
				endTime: moment(endTime).format('YYYY-MM-DDTHH:mm:ssZ'),
			};
			this.setState({ showTimes: [], loading: true });
			showTimeService.get(params).then((showTimes) => {
				this.setState({ showTimes, now: moment(), loading: false });
			});
		}
	}

	onDelete(showTimeId) {
		Modal.confirm({
			title: 'Xóa lịch chiếu phim?',
			icon: <ExclamationCircleOutlined />,
			okType: 'danger',
			content: 'Lịch chiếu sẽ bị xóa và không thể khôi phục. Bạn có chắc muốn xóa lịch chiếu này?',
			onOk: () => {
				return new Promise((resolve, reject) => {
					showTimeService
						.deleteShowTime(showTimeId)
						.then(() => {
							resolve();
							const showTimes = this.state.showTimes.filter((item) => item.id !== showTimeId);
							this.setState({ showTimes });
							toastr.success('Xóa lịch chiếu thành công');
						})
						.catch((err) => {
							reject();
							toastr.error('Xóa lịch chiếu thất bại');
						});
				});
			},
		});
	}

	onOpenModal() {
		this.setState({ modalVisible: true });
	}

	onCloseModal(showTime) {
		if (showTime.id) {
			const { selectedCinemaId, selectedStartTime, selectedEndTime } = this.state;
			this.onQueryData(selectedCinemaId, selectedStartTime, selectedEndTime);
		}

		this.setState({ modalVisible: false });
	}

	render() {
		const { selectedCinemaId, selectedStartTime, selectedEndTime } = this.state;
		const isSearched = selectedCinemaId && selectedStartTime && selectedEndTime;
		return (
			<>
				<div className="mb-5">
					<span className="mr-3">Phòng chiếu: </span>
					<TreeSelect loading={this.state.loadCinema} style={{ width: '25%' }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} treeData={this.state.cinemas} placeholder="Chọn phòng chiếu" onChange={this.onChangeCinema} />
					<span className="ml-5 mr-3">Thời gian: </span>
					<DatePicker.RangePicker style={{ width: '30%' }} onChange={this.onDateRangeChange} />
					<Button type="primary" className="float-right" onClick={this.onOpenModal}>
						Tạo suất chiếu
					</Button>
				</div>

				{!this.state.loading && this.state.showTimes.length > 0 && (
					<Timeline mode="alternate">
						{this.state.showTimes.map((showTime) => {
							const startAt = moment(showTime.startAt);
							const endAt = moment(showTime.endAt);
							const now = this.state.now;

							const color = endAt < now ? 'gray' : startAt <= now ? 'red' : 'blue';
							const dot = startAt <= now && now <= endAt && <ClockCircleOutlined style={{ fontSize: '16px' }} />;
							const date = startAt.format('YYYY-MM-DD');
							const from = startAt.format('HH:mm');
							const to = endAt.format('HH:mm');

							return (
								<Timeline.Item color={color} dot={dot}>
									{dot && <Tag color="red">NOW</Tag>}
									<Text strong>{showTime.movie.name}</Text>
									{` at ${date} from `}
									<Text code>{from}</Text>
									{' - '}
									<Text code>{to}</Text>
									{startAt > now && <Button type="link" size="small" icon={<DeleteTwoTone twoToneColor="#eb2f96" />} onClick={() => this.onDelete(showTime.id)} />}
								</Timeline.Item>
							);
						})}
						<Timeline.Item color="gray"></Timeline.Item>
					</Timeline>
				)}

				{!this.state.loading && this.state.showTimes.length === 0 && (
					<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description={isSearched ? 'Không tìm thấy suất chiếu nào' : 'Vui lòng chọn phòng chiếu và thời gian'}>
						{isSearched && (
							<Button type="primary" onClick={this.onOpenModal}>
								Tạo suất chiếu
							</Button>
						)}
					</Empty>
				)}

				{this.state.loading && <Spin size="large" className="w-100 mx-auto" />}

				<AddShowTimeModal cinemas={this.state.cinemas} visible={this.state.modalVisible} onCloseModal={this.onCloseModal} />
			</>
		);
	}
}
