import React from 'react';
import './App.css';
import firebase from './Firebase.js';
import Chart from 'chart.js';

const parseReading = (reading) =>  ({
  date: new Date(reading.epoch_time * 1000),
  humidity: reading.humidity.toFixed(0),
  temperature: reading.temperature.toFixed(0)
})

const toggleClass = (element, className) => {
  if(!element.classList.contains(className)) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

class App extends React.Component  {
  componentDidMount() {
    var db = firebase.database();
    var data = db.ref("greenhouse/data").limitToLast(1);

    data.on('child_added', function(d) {

      var lastReading = document.getElementById("last-reading");
      //var humidity = document.getElementById("humidity");
      var temperature = document.getElementById("temperature");

      var reading = d.val();
      var res = parseReading(reading);
      lastReading.innerText = res.date;
      //humidity.innerText = res.humidity;
      temperature.innerText = res.temperature;

    });
  }

  openChart(elm) {
    console.log(elm)
    toggleClass(elm, "active");
  }

  drawChart() {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            data: [10, 20, 30, 40, 50, 60]
          }],
          labels: ['January', 'February', 'March', 'April', 'May', 'June']
        }
    });
  }
  
  render() {
    return (
      <div id="app">
      <div class="page">
        <section id="container">
          <div class="header">
            <div id="last-reading"></div>
            <div id="battery">
              <img src="./battery.svg"></img>
            </div>
          </div>
          <div class="headline-figures">
            <div id="temperature" class="headline-figure">--</div>
            <img class="header-image" src="./camping-tent.svg"></img>
          </div>
        </section>
        <section id="history">
          <div class="day-row" onClick={(ev) => this.openChart(ev)}>
            <div>Mon</div>
            <span id="day-line" style={{ width: "100%" }}></span>
            <div>15°</div>
            <div>
              <div class="arrow"></div>
            </div>
          </div>
          <div class="chart">
          </div>
        </section>
      </div>
      <div class="page">
      </div>
      <div class="page-icons">
        <div class="page-icon active"></div>
        <div class="page-icon"></div>
      </div>
    </div>
    );
  }
}

export default App;
