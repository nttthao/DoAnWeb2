import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { PageHeader, DatePicker, Descriptions, Empty, Skeleton } from 'antd';
import * as branchService from '../../../service/branch.service';
import * as showTimeService from '../../../service/show-time.service';
import '../../css/cemina.sass';

export default class Cinema extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			branch: undefined,
			showTimes: [],
			selectedDate: moment(),
		};

		this.onFindShowTime = this.onFindShowTime.bind(this);
		this.onFindBranch = this.onFindBranch.bind(this);
	}

	componentDidMount() {
		const branchId = this.props.match.params.id;
		this.onFindBranch(branchId);
	}

	componentWillReceiveProps(newProps) {
		const branchId = newProps.match.params.id;
		if (+branchId !== this.state.branch.id) {
			this.onFindBranch(branchId);
		}
	}

	onFindBranch(branchId) {
		branchService.getOne(branchId).then((branch) => {
			this.setState({ branch });
		});

		const { selectedDate } = this.state;
		this.onFindShowTime(branchId, selectedDate);
	}

	onFindShowTime(branchId, date) {
		this.setState({ selectedDate: date, loading: true });

		const startTime = date.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
		const endTime = date.endOf('day').format('YYYY-MM-DDTHH:mm:ss');
		const params = { branchId, startTime, endTime };
		showTimeService.get(params).then((showTimes) => {
			this.setState({ showTimes, loading: false });
		});
	}

	render() {
		const { loading, showTimes, branch, selectedDate } = this.state;
		const movies = [...new Map(showTimes.map((item) => item.movie).map((item) => [item.id, item])).values()];
		return (
			<div className="CinemaPage">
				<div class="cont_cinema" id="a_cont_cinema">
					<div class="cont_cinema_Area">
						{branch && (
							<PageHeader
								className="site-page-header"
								title={branch?.name}
								extra={[<DatePicker disabledDate={(d) => !d || d.isBefore(moment())} allowClear={false} defaultValue={selectedDate} onChange={(date) => this.onFindShowTime(branch?.id, date)} />]}
							>
								<Descriptions size="small" column={2}>
									<Descriptions.Item label="Số phòng chiếu">{branch?.cinemas.length + ' phòng'}</Descriptions.Item>
									<Descriptions.Item label="Sức chứa">{branch?.cinemas.reduce((a, b) => a + b.horizontalSize * b.verticalSize, 0) + ' ghế'}</Descriptions.Item>
									<Descriptions.Item label="Loại phòng">{[...new Set(branch?.cinemas.map((item) => item.type))].join(', ')}</Descriptions.Item>
									<Descriptions.Item label="Địa chỉ">{branch?.address}</Descriptions.Item>
								</Descriptions>
							</PageHeader>
						)}

						<div class="time_inner pt-0">
							<div class="time_box time_list02">
								<div class="time_aType time8021">
									{movies.map((movie) => {
										const movieShowTimes = showTimes.filter((st) => st.movie.id === movie.id);
										return (
											<dl key={movie.id} class="time_line movie10656">
												<dt>
													<span class={movie.age >= 18 ? 'grade_18' : 'grade_13'}></span>
													{movie.name}
												</dt>
												<dd class="screen20050100100100 film200">
													{movieShowTimes.map((st) => {
														const disabled = moment(st.startAt).isSameOrBefore(moment());
														return (
															<ul class="theater_time list10656" screendiv="100">
																<li>
																	<Link to={disabled ? '#' : '/buy-ticket?showTimeId=' + st.id} disabled={disabled} class="time_active t1">
																		<span class="cineD2 brand">
																			<em>{st.cinema.name}</em>
																		</span>
																		<span class="clock">{moment(st.startAt).format('HH:mm')}</span>
																		<span class="ppNum">
																			<em class="color_brown" title="Kiểm tra chỗ ngồi của bạn">
																				{st.bookings.reduce((a, b) => a + b.tickets.length, 0)}
																			</em>{' '}
																			/ {st.cinema.horizontalSize * st.cinema.verticalSize} Ghế ngồi
																		</span>
																	</Link>
																</li>
															</ul>
														);
													})}
												</dd>
											</dl>
										);
									})}
									{loading && <Skeleton active className="p-4" />}
									{!loading && showTimes.length === 0 && <Empty className="py-3" description="Hiện không có suất chiếu nào trong thời gian bạn chọn" />}
								</div>
							</div>
						</div>

						<ul class="supInfo">
							<li>Lịch chiếu phim có thể thay đổi mà không báo trước</li>
							<li>Thời gian bắt đầu chiếu phim có thể chênh lệch 15 phút do chiếu quảng cáo, giới thiệu phim ra rạp</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}
