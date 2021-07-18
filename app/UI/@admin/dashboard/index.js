import React, { Component } from 'react';
import { BidirectionalBar } from '@ant-design/charts';
import { DatePicker } from 'antd';
import moment from 'moment';
import * as reportService from '../../../service/report.service';

export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			movies: [],
			branches: [],
			selectedStartTime: moment(),
			selectedEndTime: moment(),
		};

		this.onDateRangeChange = this.onDateRangeChange.bind(this);
		this.onQueryReport = this.onQueryReport.bind(this);
	}

	componentDidMount() {
		const { selectedStartTime, selectedEndTime } = this.state;
		this.onQueryReport(selectedStartTime, selectedEndTime);
	}

	onDateRangeChange(data) {
		this.onQueryReport(data[0], data[1]);
	}

	onQueryReport(startDate, endDate) {
		this.setState({ selectedStartTime: startDate, selectedEndTime: endDate, loading: true });

		startDate = moment(startDate).format('YYYY-MM-DD');
		endDate = moment(endDate).format('YYYY-MM-DD');
		reportService.get(startDate, endDate).then((report) => {
			this.setState({
				movies: report.movies,
				branches: report.branches,
				loading: false,
			});
			return;
		});
	}

	render() {
		const { selectedStartTime, selectedEndTime, movies, branches, loading } = this.state;
		const configuration = {
			xField: 'name',
			xAxis: { position: 'bottom' },
			interactions: [{ type: 'active-region' }],
			yField: ['tickets', 'revenue'],
			maxColumnWidth: 30,
			tooltip: {
				shared: true,
				showMarkers: false,
			},
		};
		const movieConfiguration = { ...configuration, data: movies };
		const branchConfiguration = { ...configuration, data: branches };

		return (
			<>
				<div className="mb-5">
					<span className="mr-3">Thời gian: </span>
					<DatePicker.RangePicker allowClear={false} defaultValue={[selectedStartTime, selectedEndTime]} style={{ width: '30%' }} onChange={this.onDateRangeChange} />
				</div>
				<h5 className="text-center">Biểu đồ doanh thu theo phim</h5>
				<BidirectionalBar loading={loading} {...movieConfiguration} />
				
				<h5 className="text-center mt-4">Biểu đồ doanh thu theo chi nhánh</h5>
				<BidirectionalBar loading={loading} {...branchConfiguration} />
			</>
		);
	}
}
