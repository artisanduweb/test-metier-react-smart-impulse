import React, {useCallback, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { DatePickerWithRange } from '@/components/custom/date-range-picker';
import { addDays, startOfWeek, /* startOfMonth, format*/ } from "date-fns"
import { toZonedTime } from 'date-fns-tz'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeZoneSelector } from './TimeZoneSelector';

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

const EURO_PER_MWH = 83;

export const EnergyChart = ({data}) => {
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [date, setDate] = useState({
    from: toZonedTime(new Date(2024, 5, 20), timezone),
    to: addDays(toZonedTime(new Date(2024, 5, 20), timezone), 20),
  })
  const [YValue, setYValue] = useState('energy')
  const [view, setView] = useState('day')
  const onTimezoneChange = (timezone) => {
    setTimezone(timezone);
  }

  // Just a hook to go to a specific date where the data is available
  useEffect(() => {
    if (data.length) {
      const maxDate = new Date(Math.max(...data.map(series => series.data[series.data.length - 1][0])))
      const minDate = addDays(maxDate, -15)
      setDate({ from: toZonedTime(minDate, timezone), to: toZonedTime(maxDate, timezone) });
    }
  }, [data, timezone])

  const filterDataByDate = useCallback((data, fromDate, toDate) => {
    return data.map(series => ({
      ...series,
      data: series.data.filter(point => {
        const date = toZonedTime(point[0], timezone);
        return date >= fromDate && date <= toDate;
      })
      .map(point => [point[0], YValue === 'currency' ? point[1] * EURO_PER_MWH : point[1]]), // Convertir les valeurs si nécessaire
    }));
  }, [YValue, timezone]);

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
        top: 30,
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: function (value) {
            if (!isFinite(value)) return '';
            const date = toZonedTime(value, timezone);
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
            console.log(YValue);
            if (YValue === 'energy'){
              return `${(value / 1e6).toFixed(2)} MwH`;
            }
            return `${(value / 1e6).toFixed(2)} €`;
          },
        },
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
      ],
      series: aggregatedData.map((d) => ({
        name: d.label,
        type: 'bar',
        barWidth: '100%',
        stack: 'total',
        data: d.data && d.data.map(d => [d[0], d[1]]),
        color: d.color,
      })),
    };
  }, [YValue, data, date, filterDataByDate, view]);

  return <>
    <ReactEcharts
      option={getOptions()}
      showLoading={data.length === 0} 
      loadingOption={{ text: 'Loading...' }}
    />
    <div className="projects grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Choisir la période</CardTitle>  
        </CardHeader>
        <CardContent>
          <DatePickerWithRange date={date} setDate={setDate}/>
        </CardContent>      
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Vue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setView}> 
            <div className="flex gap-2">
              <RadioGroupItem value="day" id="day">Jour</RadioGroupItem><Label htmlFor="r1">Jour</Label>
            </div>
            <div className="flex gap-2">
              <RadioGroupItem value="week" id="week">Semaine</RadioGroupItem><Label htmlFor="r2">Semaine</Label>
            </div>
            <div className="flex gap-2">
              <RadioGroupItem value="month" id="month">Mois</RadioGroupItem><Label htmlFor="r3">Mois</Label>
            </div> 
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>MWh / €</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={YValue} className="w-[400px]" onValueChange={setYValue}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="energy">MWh</TabsTrigger>
              <TabsTrigger value="currency">€</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Timezone</CardTitle>
        </CardHeader>
        <CardContent>
         <TimeZoneSelector onTimezoneChange={onTimezoneChange} />
        </CardContent>
      </Card>
    </div>
  </>
}
