import React from 'react';
import { format } from 'date-fns'
import styled from 'styled-components';
import Normaliser from './Normaliser';

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 70px;
    padding-left: calc(${props => props.leftMargin.toFixed(0)}% - 70px);
    padding-right: calc(${props => props.rightMargin.toFixed(0)}% - 70px);
`

const DayLine = styled.span`
    background-color: lightgrey;
    height: 1px;
    width: 100%;
    padding: 0em 0.5em 0em 0.5em;
    margin: 0.5em;
`

const Day = styled.div`
    min-width: 3em;
    margin-right: 1em;
`

const DayRow = styled.div`
    padding: 5px 15px 5px 15px;
    display: flex;
    justify-content: flex-start;
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

    render() {
        let activeClass = "";

        if(this.state.active) {
          activeClass = "active";
        }

        return (
            <>
                <DayRow className={activeClass} onClick={this.openChart}>
                    <Day>{format(this.props.date, "EEE")}</Day>
                    <Container leftMargin={this.mapToRange(this.props.min, [0, 100])} rightMargin={this.mapToRange(this.props.max, [100, 0])}>
                        <div>{this.props.min}</div>
                        <DayLine></DayLine>
                        <div>{this.props.max}</div>
                    </Container>
                    <div>
                        <div className="arrow"></div>
                    </div>
                </DayRow>
                {this.state.active && this.props.chart()}
            </>
        )
    }
}

export default History