import React, { Component, createRef } from 'react';
import HomeContent from './homeconent';
import '../../@css_user/index.sass';
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.carousel = createRef();
    }

    handleNext = () => this.carousel.current.next();
    handlePrev = () => this.carousel.current.prev();

    render() {
        return (
            <div className="HomePage">
                <HomeContent></HomeContent>
            </div>
        );
    }
}