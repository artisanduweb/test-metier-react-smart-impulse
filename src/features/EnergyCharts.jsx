import React from 'react';
import ReactEcharts from 'echarts-for-react';

export const EnergyChart = ({data}) => {
  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const getOptions = () => {
    return {
      title: {
        text: 'Energy Consumption',
        left: 'center',
        textStyle: {
          color: '#000',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: function (value) {
            return dateFormatter.format(new Date(value));
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return `${(value / 1e6).toFixed(2)} MWh`;
          },
        },
      },
    
      series:  data.map((d) => ({
        name: d.label,
        type: 'bar',
        barWidth: '100%',
        stack: 'total',
        data: d.data.map(d => [d[0], d[1]]),
        color: d.color,
      })),
    };
  }

  return <ReactEcharts
          option={getOptions()}
          showLoading={data.length === 0} 
          loadingOption={{ text: 'Loading...' }}
        />;
}
