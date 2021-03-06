import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

import CovidData from '../../../helpers/data/CovidData';

import PolicyTable from '../../shared/PolicyTable/PolicyTable';

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
    const { locationCode } = this.props.match.params;
    CovidData.getStateData(locationCode)
    .then(data => {
      if (data !== undefined) {
        this.setState({ coviddata: data });
        this.CreateChart();
      }
    });
  };

  CreateChart() {
    let chart = am4core.create("chartdiv2", am4charts.XYChart);
      if (this.state.coviddata) {
        chart.data = this.state.coviddata.filter(x => x.positiveIncrease !== 0).reverse();
      }

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.renderer.opposite = true;
    valueAxis2.syncWithAxis = valueAxis;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "positiveIncrease";
    series.dataFields.dateX = "date";
    series.tooltipText = "{positiveIncrease}+"
    series.strokeWidth = 2;
    series.minBulletDistance = 12;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "policy";
    series2.dataFields.dateX = "date";
    series2.tooltipText = "{policy}";
    series2.strokeWidth = 2;
    series2.minBulletDistance = 12;
    valueAxis2.sortBySeries = series2;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    series2.tooltip.background.cornerRadius = 20;
    series2.tooltip.background.strokeOpacity = 0;
    series2.tooltip.pointerOrientation = "vertical";
    series2.tooltip.label.minWidth = 40;
    series2.tooltip.label.minHeight = 40;
    series2.tooltip.label.textAlign = "middle";
    series2.tooltip.label.textValign = "middle";

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // bullets
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");
    let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    bullet2.circle.strokeWidth = 2;
    bullet2.circle.radius = 4;
    bullet2.circle.fill = am4core.color("#fff");

    // Create a horizontal scrollbar with preview and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.series.push(series2);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.minWidth = 50;

    dateAxis.start = 0.8;
    dateAxis.keepSelection = true;

    this.chart = chart;
  }

  componentWillUnmount() {
    this.chart.dispose();
  }

  render() {
    const { locationCode } = this.props.match.params;
    return (
      <div className="State">
        <h3 className="title">{locationCode}: IMPACT OF POLICIES ON COVID-19</h3>
        <div id="chartdiv2" style={{ width: "90%", height: "400px" }}></div>
        <PolicyTable locationCode={locationCode}/>
      </div>
    );
  }
}

export default State;
