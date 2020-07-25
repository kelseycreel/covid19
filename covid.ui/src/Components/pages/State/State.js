import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

import CovidData from '../../../helpers/data/CovidData';

am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);

class State extends React.Component {
  state = {
    coviddata: [],
    policydata: [],
  }

  componentDidMount() {
    this.GetStateData()
  }

  GetStateData = () => {
    // console.log('option 1', this.props.match.params.locationCode);
    const { locationCode } = this.props.match.params;
    CovidData.getStateData(locationCode)
    .then(data => {
      if (data !== undefined) {
        this.setState({ coviddata: data });
        this.CreateChart();
      }
    });
  };

  // componentDidUpdate(prevState) {
  //   if (this.state.statedata !== prevState.statedata) {
  //     const { coviddata } = this.state;
  //     // this.chart.data = coviddata.filter(x => x.positiveIncrease !== 0);
  //     this.chart.data = [1,2,3];
  //   }
  // }

  CreateChart() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
      if (this.state.coviddata) {
        chart.data = this.state.coviddata.filter(x => x.positiveIncrease !== 0).reverse();
      }

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = "policy";
    // categoryAxis.renderer.opposite = true;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "positiveIncrease";
    series.dataFields.dateX = "date";
    series.tooltipText = "{positiveIncrease}+"
    series.strokeWidth = 2;
    series.minBulletDistance = 12;

    // let series2 = chart.series.push(new am4charts.LineSeries());
    // series2.dataFields.valueY = "policy";
    // series2.dataFields.dateX = "date";
    // series2.tooltipText = "policy"
    // series2.strokeWidth = 2;
    // series2.minBulletDistance = 12;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";


    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // bullets
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Create a horizontal scrollbar with preview and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.minWidth = 50;

    dateAxis.start = 0.8;
    dateAxis.keepSelection = true;
  }

  render() {

    return (
      <div className="State">
        <h3>COVID19 and Policy Tracking</h3>
        <div id="chartdiv" style={{ width: "90%", height: "400px" }}></div>
      </div>
    );
  }
}

export default State;
