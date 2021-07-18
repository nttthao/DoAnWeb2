import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../@css_user/index.sass';

export default class Home extends Component {
	render() {
		return (
			<div className="HomeContentPage">
				<div class="eventBxMain" style={{ display: 'block' }}>
					<div class="eventBxMain_in">
						<div class="flbx">
							<ul class="fl pl-0">
								<li class="pbBn">
									<Link>
										<img src="https://media.lottecinemavn.com/Media/Event/b2a7b6bd970a4e6db97495e29afae10e.jpg" alt="" width="315px" height="294px" />
									</Link>
								</li>
								<li>
									<Link>
										<img src="https://media.lottecinemavn.com/Media/Event/6b77d108807f41c1b11d44dab4c2c04b.jpg" alt="" width="315px" height="164px" />
									</Link>
								</li>
							</ul>
							<ul class="fr pl-0">
								<li class="pbBn">
									<Link>
										<img src="https://media.lottecinemavn.com/Media/Event/50f2d32a285b4ef6b78d563dec61986e.jpg" alt="" width="315px" height="164px" />
									</Link>
								</li>
								<li>
									<Link>
										<img src="https://media.lottecinemavn.com/Media/Event/0bc8edcdd86e4552b7ab2b420836a0bb.jpg" alt="" width="315px" height="294px" />
									</Link>
								</li>
							</ul>
							<Link class="pbBnT">
								<img src="https://media.lottecinemavn.com/Media/Event/d9eadccd09384e97a0fb4672b0f04da0.jpg" alt="" width="650px" height="205px" />
							</Link>
						</div>
						<ul class="fr">
							<li class="pbBn">
								<Link>
									<img src="https://media.lottecinemavn.com/Media/Event/8e773ff047644f20be86b09cf63daa03.jpg" alt="" width="310px" height="240px" />
								</Link>
							</li>
							<li>
								<Link>
									<img src="https://media.lottecinemavn.com/Media/Event/3b39fb3f0b23422a89a172392714cb95.jpg" alt="" width="310px" height="444px" />
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}
