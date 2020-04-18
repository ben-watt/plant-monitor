import React from 'react';
import './App.css';
import firebase from './Firebase.js';
import Chart from 'chart.js';
import Page from './Page';
import Header from './Header';
import History from './History';
import PageContainer from './PageContainer';

const parseReading = (reading) =>  ({
  date: new Date(reading.epoch_time * 1000).toString(),
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
  constructor(props) {
    super(props);
    this.state = {
      lastReading: {
        date: "",
        humidity: "humid",
        temperature: "--"
      }
    }
  }

  componentDidMount() {
    var db = firebase.database();
    var data = db.ref("greenhouse/data").limitToLast(1);

    data.on('child_added', function(d) {
      var reading = d.val();
      this.setState({ lastReading : parseReading(reading)})
    }.bind(this));
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
        <PageContainer>
            <Page>
              <Header 
                value={this.state.lastReading.temperature} 
                date={this.state.lastReading.date} 
                image={"./camping-tent.svg"}/>
              <History />
            </Page>
            <Page>
              <Header 
                value={this.state.lastReading.humidity} 
                date={this.state.lastReading.date} 
                image={"./water.svg"} />
              <History />
            </Page>
        </PageContainer>
      </div>
    );
  }
}

export default App;
