import { Switch, Route } from 'react-router-dom';
import React, { Component } from 'react';
import Home from '../app/UI/pages/home/home';
import GiftShop from '../app/UI/pages/gift shop/giftshop';
import HomeFilm from '../app/UI/pages/home/homefilm';
import BuyTicket from '../app/UI/pages/buy ticket/buyticket';
import Cinema from '../app/UI/pages/cinema/cinema';
import Promotion from '../app/UI/pages/promotion/promotion';
import Login from '../app/UI/@user/login';
import Resgister from '../app/UI/@user/resgister';
import Profile from '../app/UI/@user/profile';
import Header from '../app/UI/pages/header/header';
import Footer from '../app/UI/pages/footer/footer';
import BookingHistory from '../app/UI/pages/booking-history';
import CodeVerification from '../app/UI/@user/codeverification';
import ForgetPassword from '../app/UI/@user/forgetPasword';
import Admin from '../app/UI/@admin/admin';

export default class RouterURL extends Component {
	render() {
		return (
			<Switch>
				<Route path="/admin" component={Admin} />

				<Route path="/">
					<div id="container" class="sub">
						<Header />
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/login" component={Login} />
							<Route path="/code" component={CodeVerification} />
							<Route path="/forget-password" component={ForgetPassword} />
							<Route path="/resgister" component={Resgister} />
							<Route path="/gift-shop" component={GiftShop} />
							<Route path="/film" component={HomeFilm} />
							<Route path="/buy-ticket" component={BuyTicket} />
							<Route path="/cinema/:id" component={Cinema} />
							<Route path="/promotion" component={Promotion} />
							<Route path="/profile" component={Profile} />
							<Route path="/booking-histories" component={BookingHistory} />
						</Switch>
						<Footer />
					</div>
				</Route>
			</Switch>
		);
	}
}
