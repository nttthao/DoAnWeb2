import React, { Component } from 'react';
import { DatePicker, Empty, Radio, Space, Modal, message, Tooltip, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import qs from 'qs';
import * as showTimeService from '../../../service/show-time.service';
import * as bookingService from '../../../service/booking.service';
import * as movieService from '../../../service/movie.service';
import * as branchService from '../../../service/branch.service';
import { SortMovieType } from '../../../constants/movie.const';
import '../../css/buyticket.sass';

export default class BuyTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			date: moment(),
			movies: [],
			branches: [],
			selectedMovieId: undefined,
			selectedBranchId: undefined,
			selectedShowTimeId: undefined,
			selectedSeats: [],
			isRedirect: false,
		};

		this.handleOk = this.handleOk.bind(this);
		this.onChangeDate = this.onChangeDate.bind(this);
		this.onChangeMovie = this.onChangeMovie.bind(this);
		this.onChangeBranch = this.onChangeBranch.bind(this);
		this.onChangeShowTime = this.onChangeShowTime.bind(this);
		this.onSelectSeat = this.onSelectSeat.bind(this);
	}

	componentDidMount() {
		const queries = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
		const { movieId, showTimeId } = queries;

		const now = moment().utc().format('YYYY-MM-DDTHH:mm:ss');
		const params = { startTime: now };

		this.setState({ data: [], loading: true });

		movieService.getPagingListMovie(1, 100, SortMovieType.Name, now).then((data) => {
			const { selectedMovieId } = this.state;
			this.setState({
				movies: data?.items || [],
				selectedMovieId: +movieId || selectedMovieId || data?.items[0]?.id,
			});
		});

		branchService.get().then((branches) => {
			this.setState({ branches });
		});

		showTimeService.get(params).then((data) => {
			this.setState({ data, loading: false });
			if (showTimeId) {
				const showTime = data.find((item) => item.id === +showTimeId);
				this.setState({
					selectedMovieId: showTime.movie.id,
					date: moment(showTime.startAt).startOf('day'),
					selectedBranchId: showTime.cinema.branch.id,
					selectedShowTimeId: showTime.id,
				});
			}
		});
	}

	onChangeDate(date) {
		this.setState({ date, selectedBranchId: undefined, selectedShowTimeId: undefined, selectedSeats: [] });
	}

	onChangeMovie(event) {
		this.setState({ selectedMovieId: event.target.value, selectedBranchId: undefined, selectedShowTimeId: undefined, selectedSeats: [] });
	}

	onChangeBranch(event) {
		this.setState({ selectedBranchId: event.target.value, selectedShowTimeId: undefined, selectedSeats: [] });
	}

	onChangeShowTime(event) {
		this.setState({ selectedShowTimeId: event.target.value, selectedSeats: [] });
	}

	onSelectSeat(seat) {
		const index = this.state.selectedSeats.findIndex((item) => item === seat);
		if (index === -1) {
			this.setState({ selectedSeats: [...this.state.selectedSeats, seat] });
		} else {
			this.setState({ selectedSeats: this.state.selectedSeats.filter((item) => item !== seat) });
		}
	}

	handleOk() {
		const { data, selectedShowTimeId, selectedSeats } = this.state;
		const showTime = data.find((item) => item.id === selectedShowTimeId);
		Modal.confirm({
			title: 'Xác nhận đặt vé?',
			icon: <ExclamationCircleOutlined />,
			content:
				`Bạn sẽ đặt vé xem phim ${showTime.movie.name} vào lúc ` +
				`${moment(showTime.startAt).format('DD/MM/yyyy HH:mm')} với số ghế: ` +
				`${selectedSeats.join(', ')}. Số tiền cần thanh toán là 100,000 x ` +
				`${selectedSeats.length} = ${(100000 * selectedSeats.length).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}đ.`,
			onOk: () => {
				return new Promise((resolve, reject) => {
					bookingService
						.create({
							showTimeId: selectedShowTimeId,
							tickets: selectedSeats.map((item) => ({
								seat: item,
								price: 100000,
							})),
						})
						.then(() => {
							resolve();
							this.setState({ isRedirect: true });
							message.success('Đặt vé thành công');
						})
						.catch((err) => {
							reject();
							message.error('Đặt vé thất bại');
						});
				});
			},
		});
	}

	renderSeatContainer(showTime) {
		const result = [];
		for (let i = 0; i < showTime?.cinema.verticalSize; i++) {
			result.push(
				<Space key={'seat' + showTime.id + i} className="mb-2">
					{this.renderSeats(showTime, i)}
				</Space>
			);
		}

		return result;
	}

	renderSeats(showTime, i) {
		const result = [];
		for (let j = 0; j < showTime.cinema.horizontalSize; j++) {
			const seat = (i + 10).toString(36).toUpperCase() + (j + 1);
			const selectedSeat = this.state.selectedSeats.find((item) => item === seat);
			let bookedSeat = false;
			showTime.bookings.forEach((booking) => {
				booking.tickets.forEach((ticket) => {
					if (ticket.seat === seat) bookedSeat = true;
				});
			});

			result.push(
				<Tooltip key={showTime.id + i + j} placement="top" title={(bookedSeat && 'Đã đặt') || (selectedSeat && 'Đã chọn')} arrowPointAtCenter>
					<Button disabled={bookedSeat} className="seat" type={selectedSeat && 'primary'} onClick={() => this.onSelectSeat(seat)}>
						{seat}
					</Button>
				</Tooltip>
			);
		}

		return result;
	}

	render() {
		const isAuthenticated = localStorage.getItem('access_token');
		if (!isAuthenticated) {
			return <Redirect to={'/login'} />;
		}

		const { loading, date, data, selectedMovieId, selectedBranchId, selectedShowTimeId, selectedSeats, isRedirect, movies, branches } = this.state;
		if (isRedirect) {
			return <Redirect to="/booking-histories" />;
		}

		const filterData = data.filter((item) => date.isSame(moment(item.startAt).format('YYYY-MM-DD'), 'day') && item.movie.id === selectedMovieId);

		const availableBranches = [...new Map(filterData.map((item) => item.cinema.branch).map((item) => [item.id, item])).values()];
		const showTimes = filterData.filter((item) => item.cinema.branch.id === selectedBranchId);
		const showTime = showTimes.find((item) => item.id === selectedShowTimeId);

		return (
			<div className="BuyTicketPage mb-0">
				<div class="cont_ticket">
					<div class="cont_ticket_Area">
						<div class="ticket_inner">
							<div class="ticket_step">
								<div class="ticket_left">
									<dl class="theater_header">
										<dt class="Lang-LBL0001">Rạp</dt>
										<dd class="txt_add"></dd>
										<dt class="date_picker">
											<Space direction="vertical">
												<DatePicker disabledDate={(d) => !d || d.isBefore(moment().add(-1, 'd'))} allowClear={false} value={this.state.date} onChange={this.onChangeDate} />
											</Space>
										</dt>
									</dl>

									<div class="theater_cont">
										<span className="ml-4 mb-3" style={{ fontWeight: 'bold', fontSize: '16px' }}>
											Phòng chiếu:
										</span>
										<div className="m-4">
											{selectedMovieId && (
												<Radio.Group value={selectedBranchId} onChange={this.onChangeBranch}>
													<Space size={[20, 10]} wrap>
														{branches.map((branch) => {
															const isDisabled = availableBranches.findIndex((item) => item.id === branch.id) === -1;
															return (
																<Tooltip key={branch.id} placement="top" title={isDisabled && 'Không có suất chiếu nào'} arrowPointAtCenter>
																	<Radio.Button ghost value={branch.id} className="text-center" disabled={isDisabled} style={{ width: '130px', height: '40px', fontSize: '12px' }}>
																		<p className="mt-1">{branch.name}</p>
																	</Radio.Button>
																</Tooltip>
															);
														})}
													</Space>
												</Radio.Group>
											)}
										</div>
									</div>

									{selectedBranchId && (
										<>
											<span className="ml-4 mb-3" style={{ fontWeight: 'bold', fontSize: '16px' }}>
												Giờ chiếu:
											</span>
											<div className="m-4">
												<Radio.Group value={selectedShowTimeId} onChange={this.onChangeShowTime}>
													<Space>
														{showTimes.map((showTime) => (
															<Radio.Button key={'showtime_' + showTime.id} value={showTime.id} className="text-center" style={{ height: 'auto', 'line-height': 16 }}>
																<small>{showTime.cinema.name}</small>
																<br />
																<h5 className="font-weight-bold m-0">{moment(showTime.startAt).format('HH:mm')}</h5>
																<small>
																	{showTime.bookings.reduce((a, b) => a + b.tickets.length, 0)} / {showTime.cinema.horizontalSize * showTime.cinema.verticalSize} ghế ngồi
																</small>
															</Radio.Button>
														))}
													</Space>
												</Radio.Group>
											</div>
										</>
									)}
								</div>
								<div class="ticket_right" style={{ maxHeight: '400px' }}>
									<dl class="theater_header">
										<dt class="Lang-LBL0011">Phim</dt>
									</dl>
									<div class="movie_cont">
										<div class="scroll_bar">
											<Radio.Group value={selectedMovieId} onChange={this.onChangeMovie}>
												<Space direction="vertical">
													{movies.map((movie) => (
														<Radio key={movie.id} value={movie.id} className="ml-3" style={{ border: 'none' }}>
															<div>
																{movie.age >= 18 ? <span class="grade_18">18</span> : <span class="grade_13">13</span>}
																<em>{movie.name.toUpperCase()}</em>
															</div>
														</Radio>
													))}
												</Space>
											</Radio.Group>
											{!loading && movies.length === 0 && <Empty description="Hiện không có phim nào sắp chiếu" />}
										</div>
									</div>
								</div>
							</div>
						</div>
						{selectedShowTimeId && (
							<>
								<div style={{ background: 'white' }} className="pb-3">
									<span className="ml-4 mb-3" style={{ fontWeight: 'bold', fontSize: '16px' }}>
										Ghế ngồi:
									</span>
									<div className="mx-4 mt-4 mb-1">
										{this.renderSeatContainer(showTime)}
										{selectedSeats.length > 0 && (
											<>
												<br />
												<br />
												<Button size="large" type="primary" onClick={this.handleOk}>
													Đặt vé
												</Button>
											</>
										)}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}
