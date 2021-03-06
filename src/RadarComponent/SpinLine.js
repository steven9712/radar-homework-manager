import React, { Component } from 'react';
import util from './utils.js'

class SpinLine extends Component {


	constructor(props) {
		super();
		let state = {angle:0}
		this.state = state;
	}

	componentDidMount() {
		let interval  = 50;
		let rpm = this.props.rpm;
		let step = rpm * (360 / (60000 / interval));
		this.spinInterval = setInterval(() => {
			let state = this.state;
			state.angle = this.state.angle + step;
			if(this.state.angle > 360)
				state.angle = 0;
			this.props.setLineAngle(state.angle);
			this.setState(state);
		},interval)
	}

	componentWillUnmount() {
		clearInterval(this.spinInterval);
	}

	
	render() {
		if(!this.props.show) return null;

		let edge = util.polarToCartesian(this.props.center.x, this.props.center.y, this.props.radius, this.state.angle)
		return (
			<line 
			id="spinLine"
			stroke={this.props.lineColor}
			strokeWidth="10"
			x1={this.props.center.x} y1={this.props.center.y}
			x2={edge.x} y2={edge.y}
			/>
				

		)
	}
}

export default SpinLine;