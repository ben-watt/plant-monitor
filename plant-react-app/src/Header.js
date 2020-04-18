import React from 'react'

const Header = (props) => {
    return (
        <section id="container">
            <div className="header">
            <div id="last-reading">{props.date}</div>
                <div id="battery">
                <img src="./battery.svg"></img>
                </div>
            </div>
            <div className="headline-figures">
                <div id="temperature" className="headline-figure">{props.value}</div>
                <img className="header-image" src={props.image}></img>
            </div>
        </section>
    )
}

export default Header;