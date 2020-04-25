import React from 'react';
import { format, isToday, isYesterday } from 'date-fns'
import styled from 'styled-components';
import Normaliser from './Normaliser';

const Day = styled.div`
    min-width: 3em;
    margin-right: 1em;
`

const Range = styled.div`
    font-weight: normal;
    justify-self: end;
`

const DayRow = styled.div`
    padding: 5px 15px 5px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &.active .arrow {
        visibility: visible;
        transform: rotate(-45deg);
        transition-duration: 300ms;
    }
`
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeClass: false
        }
    }

    openChart = () => {
        this.setState(prevState => ({ active: !prevState.active }));
    }

    mapToRange = (value, range) => {
        return new Normaliser()
            .withDomain(this.props.totalMin, this.props.totalMax)
            .mapToRange(range[0], range[1])
            .normalise(value);
    }

    displayDate = (date) => {
        if(isToday(date))
            return "Today";
        else if(isYesterday(date))
            return "Yesterday";
        else
            return format(this.props.date, "EEEE");
    }

    render() {
        let activeClass = "";

        if(this.state.active) {
          activeClass = "active";
        }

        return (
            <>
                <DayRow className={activeClass} onClick={this.openChart}>
                    <Day>{this.displayDate(this.props.date)}</Day>
                    <div>
                        <div className="arrow"></div>
                    </div>
                    <Range>{this.props.min}-{this.props.max}{this.props.suffex}</Range>
                </DayRow>
                {this.state.active && this.props.chart()}
            </>
        )
    }
}

export default History