import React, {useCallback, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { DatePickerWithRange } from '@/components/custom/date-range-picker';
import { addDays,  } from "date-fns"

export const EnergyChart = ({data}) => {

  const [date, setDate] = useState({
    from: new Date(2024, 5, 20),
    to: addDays(new Date(2024, 5, 20), 20),
  })

  // Hook to go to a specific date where the data is available
  useEffect(() => {
    if (data.length) {
      const maxDate = new Date(Math.max(...data.map(series => series.data[series.data.length - 1][0])))
      const minDate = addDays(maxDate, -15)
      setDate({ from: minDate, to: maxDate });
    }
  }, [data])

  const filterDataByDate = (data, fromDate, toDate) => {
    return data.map(series => ({
      ...series,
      data: series.data.filter(point => {
        const date = new Date(point[0]);
        return date >= fromDate && date <= toDate;
      }),
    }));
  };

  const getOptions = useCallback(() => {
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const filteredData = date && date.from && date.to ? filterDataByDate(data, date.from, date.to) : data

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
      legend: {
        data: filteredData.map(d => d.label),
        bottom: 10,
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
    
      series:  filteredData.map((d) => ({
        name: d.label,
        type: 'bar',
        barWidth: '100%',
        stack: 'total',
        data: d.data.map(d => [d[0], d[1]]),
        color: d.color,
      })),
    };
  }, [data, date]);



  return <>
    <ReactEcharts
      option={getOptions()}
      showLoading={data.length === 0} 
      loadingOption={{ text: 'Loading...' }}
    />
    <div className="flex flex-col gap-3 py-2">
      <span className="text-sm font-semibold opacity-80">
        Pick the period
      </span>
      <DatePickerWithRange date={date} setDate={setDate}/>
    </div>
    {/* TODO: Euro */}
  </>
}
