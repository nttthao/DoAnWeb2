import { Card, List, Typography } from 'antd';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../css/booking-history.sass';
import * as bookingService from '../../../service/booking.service';
import moment from 'moment';

export default class BookingHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: true,
		};
	}

	componentDidMount() {
		bookingService.get(1, 9999999999999).then((data) => {
			this.setState({ data: data.items, loading: false });
		});
	}

	render() {
		const isAuthenticated = localStorage.getItem('access_token');
		if (!isAuthenticated) {
			return <Redirect to={'/login'} />;
		}
		return (
			<div className="booking-history-page">
				<h4 className="text-center">Lịch sử đặt vé</h4>
				<List
					loading={this.state.loading}
					grid={{ gutter: 16, column: 3 }}
					dataSource={this.state.data}
					renderItem={(item) => (
						<List.Item>
							<Card>
								<Typography.Text strong>
									<h5 className="text-bold">{item.showTime.movie.name}</h5>
								</Typography.Text>
								Time: {moment(item.showTime.startAt).format('DD/MM/YYYY HH:mm')}
								<br />
								Seats: <Typography.Text strong>{item.tickets.map((item) => item.seat).join(', ')}</Typography.Text>
								<br />
								Price: <Typography.Text warning>{item.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'đ'}</Typography.Text>
							</Card>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}
