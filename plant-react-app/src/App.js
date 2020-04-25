import React from 'react';
import './App.css';
import firebase from './Firebase.js';
import Chart from 'chart.js';
import Page from './Page';
import Header from './Header';
import History from './History';
import PageContainer from './PageContainer';
import { formatDistance, getHours } from 'date-fns'
import LineChart from './LineChart';

const parseReading = (reading) =>  ({
  date: new Date(reading.epoch_time * 1000),
  humidity: parseInt(reading.humidity.toFixed(0)),
  temperature: parseInt(reading.temperature.toFixed(0)),
  voltage: reading.voltage.toString() ?? "Unknown"
})

const highestValue = (value1, value2) => {
  return value1 > value2 ? value1 : value2;
}

const lowestValue = (value1, value2) => {
  return value1 < value2 ? value1 : value2;
}

class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      lastReading: {
        date: new Date(),
        humidity: "--",
        temperature: "--"
      },
      totalMaxTemperature: Number.MIN_SAFE_INTEGER,
      totalMinTemperature: Number.MAX_SAFE_INTEGER,
      totalMaxHumidity: Number.MIN_SAFE_INTEGER,
      totalMinHumidity: Number.MAX_SAFE_INTEGER,
      history: {}
    }
  }

  componentDidMount() {
    var db = firebase.database();
    var data = db.ref("greenhouse/data").limitToLast(1);

    data.on('child_added', function(d) {
      var reading = d.val();
      this.setState({ lastReading : parseReading(reading)})
    }.bind(this));

    var data = db.ref("greenhouse/data").limitToLast(100);

    data.on('child_added', function(d) {
      var reading = d.val();
      var parsedReading = parseReading(reading);
      var dateKey = parsedReading.date.toISOString().substring(0,10);

      this.setState(prevState => {
        if(prevState.history[dateKey] != null) {
          prevState.history[dateKey] = {
            maxTemperature: highestValue(parsedReading.temperature, prevState.history[dateKey].maxTemperature),
            minTemperature: lowestValue(parsedReading.temperature, prevState.history[dateKey].minTemperature),
            maxHumidity: highestValue(parsedReading.humidity, prevState.history[dateKey].maxHumidity),
            minHumidity: lowestValue(parsedReading.humidity, prevState.history[dateKey].minHumidity),
            readings: prevState.history[dateKey].readings.concat(parsedReading)
          }
        } else {
          prevState.history[dateKey] = {
            maxTemperature: parsedReading.temperature,
            minTemperature: parsedReading.temperature,
            maxHumidity: parsedReading.humidity,
            minHumidity: parsedReading.humidity,
            readings: [parsedReading]
          };
        }

        return {
          ...prevState,
          totalMaxTemperature: highestValue(prevState.totalMaxTemperature, parsedReading.temperature),
          totalMinTemperature: lowestValue(prevState.totalMinTemperature, parsedReading.temperature),
          totalMaxHumidity: highestValue(prevState.totalMaxHumidity, parsedReading.humidity),
          totalMinHumidity: lowestValue(prevState.totalMinHumidity, parsedReading.humidity),
          history: prevState.history
        }
      })
    }.bind(this));
  }

  getTemperatureHeader() {
    var date = new Date();
    var hours = getHours(date);
    if(hours > 19 || hours < 5) {
      return <Header 
        leftColour="#0D38D1"
        rightColour="#701872"
        value={this.state.lastReading.temperature} 
        suffex={"°C"}
        date={formatDistance(this.state.lastReading.date, new Date())} 
        image={"./camping-tent.svg"}
        bottom />
    } else {
      return <Header 
        leftColour="#D1190D"
        rightColour="#F6C821"
        value={this.state.lastReading.temperature} 
        suffex={"°C"}
        date={formatDistance(this.state.lastReading.date, new Date())} 
        image={"./beach.svg"}
        bottom />
    }
  }

  getTemperatureHistory() {
    let history = []
    for(var dateGroup in this.state.history) {
      let value = this.state.history[dateGroup];
      let chartData = value.readings.map(reading => ({ x: reading.date, y: reading.temperature }))

      history.push(
        <History key={dateGroup.toString()} 
          totalMin={this.state.totalMinTemperature} 
          totalMax={this.state.totalMaxTemperature}
          min={value.minTemperature} 
          max={value.maxTemperature} 
          suffex={"°C"}
          date={value.readings[0].date} 
          chart={() => { 
            return <LineChart data={chartData} colour={"#40DA46"} />
          }} />)
    }
    return history.reverse();
  }

  getHumidityHistory() {
    let history = [];

    for(var dateGroup in this.state.history) {
      let value = this.state.history[dateGroup];
      let chartData = value.readings.map(reading => ({ x: reading.date, y: reading.humidity }))

      history.push(
        <History key={dateGroup.toString()} 
          totalMin={this.state.totalMinHumidity} 
          totalMax={this.state.totalMaxHumidity}
          min={value.minHumidity} 
          max={value.maxHumidity} 
          suffex={"%"}
          date={value.readings[0].date} 
          chart={() => { 
            return <LineChart data={chartData} colour={"#CD10DD"} />
          }} />)
    }

    return history.reverse();
  }
  
  render() {
    return (
      <div id="app">
        <PageContainer>
            <Page>
              { this.getTemperatureHeader() }
              <section id="history">
                { this.getTemperatureHistory() }
              </section>
            </Page>
            <Page>
              <Header 
                leftColour="#1FD7FF"
                rightColour="#EBECED"
                value={this.state.lastReading.humidity}
                suffex={"%"}
                date={formatDistance(this.state.lastReading.date, new Date())} 
                image={"./water.svg"} />
                <section id="history">
                  { this.getHumidityHistory() }
                </section>
            </Page>
        </PageContainer>
      </div>
    );
  }
}

export default App;
