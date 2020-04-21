import React from 'react';
import { format } from 'date-fns'

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeClass: false
        }
    }

    openChart = (ev) => {
        this.setState(prevState => ({ active: !prevState.active }));
    }

    render() {
        let activeClass = "";

        if(this.state.active) {
          activeClass = "active";
        }

        return (
            <>
                <div className={`day-row ${activeClass}`} onClick={this.openChart}>
                    <div>{format(this.props.readings[0].date, "EEE")}</div>
                    <div>{this.props.min}</div>
                    <span id="day-line" style={{ width: "100%" }}></span>
                    <div>{this.props.max}</div>
                    <div>
                        <div className="arrow"></div>
                    </div>
                </div>
                <div className="chart">
                </div>
            </>
        )
    }
}

export default History