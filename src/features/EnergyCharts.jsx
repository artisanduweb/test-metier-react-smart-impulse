import React, {useCallback, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { DatePickerWithRange } from '@/components/custom/date-range-picker';
import { addDays, startOfWeek, /* startOfMonth, format*/ } from "date-fns"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

const aggregateDataByWeek = (data) => {
  const aggregatedData = {};

  data.forEach(series => {
    const weeklyData = {};
    series.data.forEach(([timestamp, value]) => {
      const date = new Date(timestamp);
      // Start of the week (Monday)
      const startOfWeek = new Date(date);
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(date.getDate() - (date.getDay() + 6) % 7); // Adjust to Monday
      const weekTimestamp = startOfWeek.getTime();

      if (!weeklyData[weekTimestamp]) {
        weeklyData[weekTimestamp] = 0;
      }

      weeklyData[weekTimestamp] += value;
    });

    aggregatedData[series.label] = Object.entries(weeklyData).map(([timestamp, value]) => [parseInt(timestamp), value]);
  });

  return Object.keys(aggregatedData).map(label => ({
    label,
    color: data.find(series => series.label === label).color,
    data: aggregatedData[label],
    type: data.find(series => series.label === label).type,
  }));
};

export const EnergyChart = ({data}) => {
  const [date, setDate] = useState({
    from: new Date(2024, 5, 20),
    to: addDays(new Date(2024, 5, 20), 20),
  })

  const [view, setView] = useState('day')
  // Just a hook to go to a specific date where the data is available
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

    const weekFormatter = new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
      day: '2-digit',
    });

    const filteredData = date && date.from && date.to ? filterDataByDate(data, date.from, date.to) : data
    const aggregatedData = view === "week" ? aggregateDataByWeek(filteredData) : filteredData

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
            const date = new Date(value);
            if (view === 'week') {
              const weekStart = weekFormatter.format(startOfWeek(date));
              const weekEnd = weekFormatter.format(addDays(date, 6));
              return `${weekStart} - ${weekEnd}`;
            }
            return dateFormatter.format(date);  
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
      series: aggregatedData.map((d) => ({
        name: d.label,
        type: 'bar',
        barWidth: '100%',
        stack: 'total',
        data: d.data && d.data.map(d => [d[0], d[1]]),
        color: d.color,
      })),
    };
  }, [data, date, view]);

  return <>
    <ReactEcharts
      option={getOptions()}
      showLoading={data.length === 0} 
      loadingOption={{ text: 'Loading...' }}
    />
    <div className="projects grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Pick the period</CardTitle>  
        </CardHeader>
        <CardContent>
          <DatePickerWithRange date={date} setDate={setDate}/>
        </CardContent>      
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setView}> 
            <div className="flex gap-2">
              <RadioGroupItem value="day" id="day">Jour</RadioGroupItem><Label htmlFor="r1">Jour</Label>
            </div>
            <div className="flex gap-2">
              <RadioGroupItem value="week" id="week">Semaine</RadioGroupItem><Label htmlFor="r2">Default</Label>
            </div>
            <div className="flex gap-2">
              <RadioGroupItem value="month" id="month">Mois</RadioGroupItem><Label htmlFor="r3">Mois</Label>
            </div> 
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
    {/* TODO: Euro */}
  </>
}
