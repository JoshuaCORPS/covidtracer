import axios from 'axios';

export const showLineGraph = async (id, rev, cc = '') => {
  const datelastThirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toLocaleDateString()
    .split('/');
  const year = datelastThirtyDays[2];
  const month =
    parseInt(datelastThirtyDays[0]) < 10
      ? `0${datelastThirtyDays[0]}`
      : datelastThirtyDays[0];
  const days =
    parseInt(datelastThirtyDays[1]) < 10
      ? `0${datelastThirtyDays[1]}`
      : datelastThirtyDays[1];

  const dateNow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    .toLocaleDateString()
    .split('/');
  const endYear = dateNow[2];
  const endMonth = parseInt(dateNow[0]) < 10 ? `0${dateNow[0]}` : dateNow[0];
  const endDay = parseInt(dateNow[1]) < 10 ? `0${dateNow[1]}` : dateNow[1];

  const url =
    id === 'chartContainer'
      ? 'https://api.coronatracker.com/v3/stats/worldometer/totalTrendingCases'
      : `https://api.coronatracker.com/v5/analytics/trend/country?countryCode=${cc}&startDate=${year}-${month}-${days}&endDate=${endYear}-${endMonth}-${endDay}`;

  const data = await axios(url);

  const oneMonthData = [];
  for (let i = 0; i < 31; i++) {
    if (data.data[i]) oneMonthData.push(data.data[i]);
    else {
      oneMonthData.push(oneMonthData[oneMonthData.length - 1]);
    }
  }

  const confirmed = createDataPoints(oneMonthData, 'confirmed', rev);
  const recovered = createDataPoints(oneMonthData, 'recovered', rev);
  const deaths = createDataPoints(oneMonthData, 'deaths', rev);

  const chart = new CanvasJS.Chart(`${id}`, {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Outbreak Over Time',
    },
    axisX: {
      valueFormatString: 'DD MMM',
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
      },
    },
    axisY: {
      title: 'Past 30 days Chart',
      crosshair: {
        enabled: true,
      },
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      horizontalAlign: 'left',
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries,
    },
    data: [
      {
        type: 'line',
        showInLegend: true,
        name: 'Confirmed',
        markerType: 'square',
        xValueFormatString: 'DD MMM, YYYY',
        color: 'orange',
        lineColor: 'orange',
        dataPoints: confirmed,
      },
      {
        type: 'line',
        showInLegend: true,
        name: 'Recovered',
        lineDashType: 'dash',
        dataPoints: recovered,
      },
      {
        type: 'line',
        showInLegend: true,
        name: 'Deaths',
        lineDashType: 'dash',
        dataPoints: deaths,
      },
    ],
  });

  chart.render();

  function toogleDataSeries(e) {
    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }
};

export const showColumnGraph = async () => {
  const data = await axios(
    'https://api.coronatracker.com/v5/analytics/dailyNewStats?limit=10'
  );

  const dataPoints = createColumnDataPoints(data.data);

  var chart = new CanvasJS.Chart('chartContainer2', {
    animationEnabled: true,
    theme: 'light2', // "light1", "dark1", "dark2"
    title: {
      text: 'Daily New Cases',
    },
    axisY: {
      title: 'Top 10 Countries Chart',
    },
    data: [
      {
        type: 'column',
        showInLegend: true,
        legendMarkerColor: 'grey',
        legendText: ' ',
        dataPoints,
      },
    ],
  });
  chart.render();
};

const createDataPoints = (arr, set, rev) => {
  const points = [];

  arr.forEach((el) => {
    const [m, d, y] = new Date(rev ? el.lastUpdated : el.last_updated)
      .toLocaleDateString()
      .split('/');

    const obj = {
      x: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
      y:
        set === 'confirmed'
          ? rev
            ? el.totalConfirmed
            : el.total_confirmed
          : set === 'recovered'
          ? rev
            ? el.totalRecovered
            : el.total_recovered
          : rev
          ? el.totalDeaths
          : el.total_deaths,
    };

    points.push(obj);
  });

  return rev ? points.reverse() : points;
};

const createColumnDataPoints = (arr) => {
  const points = [];
  arr.forEach((el) => {
    const obj = {
      y: el.daily_cases,
      label: el.country,
    };
    if (el.country !== 'World') points.push(obj);
  });

  return points;
};
