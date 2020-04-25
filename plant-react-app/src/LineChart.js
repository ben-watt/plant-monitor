import React, { useRef } from 'react';
import Chart from 'chart.js';
import styled from 'styled-components';

const ChartContainer = styled.div`
	position: relative;
	height: 10em;
    display: block;
    box-shadow: inset 0px 0px 3px 1px grey;
`

class LineChart extends React.Component {
    constructor(props) {
		super(props)
		this.chartContainer = React.createRef();
		this.state = {
			data: this.props.data
		}
    }

    componentDidMount = () => {
		var color = Chart.helpers.color;
		var config = {
			type: 'line',
			data: {
				datasets: [{
					label: null,
					backgroundColor: this.props.colour || color("#0BDA07").alpha(0.5).rgbString(),
                    borderColor: this.props.colour || "#0BDA07",
                    borderWidth: 1,
					fill: false,
					data: this.state.data
				}]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: true
                },
				responsive: true,
				scales: {
					xAxes: [{
						type: 'time',
						display: false,
						scaleLabel: {
							display: false,
						},
						ticks: {
							major: {
								fontColor: '#FF0000'
							}
						}
					}],
					yAxes: [{
						display: false,
						scaleLabel: {
							display: false,
						}
					}]
				}
			}
		};
		
		let canvas = this.chartContainer.current.children[0];
        new Chart(canvas, config);
    }

    render() {
        return (
            <ChartContainer ref={this.chartContainer} >
                <canvas></canvas>
            </ChartContainer>
        )
    }
}

export default LineChart;