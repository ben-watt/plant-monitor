import React from 'react';


class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
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
                    <div>Mon</div>
                    <span id="day-line" style={{ width: "100%" }}></span>
                    <div>15°</div>
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