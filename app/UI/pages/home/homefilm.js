import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { SortMovieType } from '../../../constants/movie.const';
import { getPagingListMovie } from '../../../service/movie.service';
import '../../@css_user/index.sass';

export default class HomeFilm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mostViewMovies: [],
			newestMovies: [],
		};
	}

	componentDidMount() {
		const now = moment().utc().format('YYYY-MM-DDTHH:mm:ss');
		getPagingListMovie(1, 100, SortMovieType.Newest, now).then((data) => {
			this.setState({
				newestMovies: data?.items || [],
			});
		});

		getPagingListMovie(1, 100, SortMovieType.View, now).then((data) => {
			this.setState({
				mostViewMovies: data?.items || [],
			});
		});
	}

	formatDate(date) {
		return moment(date).format('DD/MM/YYYY');
	}

	renderItem(value, index) {
		return (
			<li key={value.id}>
				<div class="curr_box">
					<span class="num">{index}</span>
					<span class="img">
						<Link to={'buy-ticket?movieId=' + value.id} id="aFocusItem0">
							<img src={value.posterUrl} alt={value.posterUrl} />
						</Link>
					</span>
					<div class="layer_hover">
						<Link to={'buy-ticket?movieId=' + value.id} class="btn_reserve">
							Đặt vé
						</Link>
					</div>
				</div>
				<dl class="list_text">
					<dt>
						<Link to={'buy-ticket?movieId=' + value.id}>
							<span class={value.age >= 18 ? 'grade_18' : 'grade_13'}></span>
							{value.name}
						</Link>
					</dt>
					<dd>
						<span class="rate">{value.duration} Phút</span>
						<span class="grade">
							<em>{this.formatDate(value.publishAt)}</em>
						</span>
					</dd>
				</dl>
			</li>
		);
	}

	render() {
		return (
			<div className="HomeContentPage">
				<div id="content">
					<div class="screen_cwrap">
						<div class="tab_content on">
							<h3 class="cinema_stit pt30">Mới công chiếu</h3>
							<ul class="curr_list movie_clist" id="ulMovieList">
								{this.state.newestMovies.map((value, index) => this.renderItem(value, index))}
							</ul>

							<h3 class="cinema_stit pt30">Được xem nhiều nhất</h3>
							<ul class="curr_list movie_clist" id="ulMovieList">
								{this.state.mostViewMovies.map((value, index) => this.renderItem(value, index))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
