import React from 'react';

const openChart = (elm) => {
    console.log("open");
}

const History = () => {
    return (
        <section id="history">
            <div className="day-row" onClick={(ev) => openChart(ev)}>
                <div>Mon</div>
                <span id="day-line" style={{ width: "100%" }}></span>
                <div>15°</div>
                <div>
                <div className="arrow"></div>
                </div>
            </div>
            <div className="chart">
            </div>
        </section>
    )
}

export default History