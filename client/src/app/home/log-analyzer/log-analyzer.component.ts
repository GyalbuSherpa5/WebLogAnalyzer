import {Component, ViewChild} from '@angular/core';
import {LogAnalyzerService} from "../../service/log-analyzer.service";
import {ChartComponent} from "ng-apexcharts";
import {EChartsOption} from "echarts";
import * as echarts from 'echarts';
// @ts-ignore
import * as worldMap from "src/assets/worldmap.json";

export type ChartOptions = {
  series?: any;
  chart?: any;
  dataLabels?: any;
  title?: any;
  colors?: any;
  plotOptions?: any;
  xaxis?: any;
};

export type PieChartOptions = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  fill: any;
  legend: any;
  dataLabels: any;
};

@Component({
  selector: 'app-log-analyzer',
  templateUrl: './log-analyzer.component.html',
  styleUrls: ['./log-analyzer.component.scss']
})
export class LogAnalyzerComponent {


  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public pieChartOptions!: Partial<PieChartOptions>;

  data: any;

  constructor(
    private logAnalyzerService: LogAnalyzerService,
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      title: {
        text: "User By time of day"
      }
    };
  }

  ngOnInit(): void {
    this.logAnalyzerService.getWebLogs().subscribe(
      (data: any) => {
        this.data = data;
        this.transformDataForChart();
        this.mapFunction();
        this.transformDataForBarChart();
        this.transformDataForPieChart();
      })
  }

  transformDataForChart(): void {
    this.chartOptions.series = Object.keys(this.data.timeResponse)
      .filter(day => day !== 'Day')
      .sort(this.sortDays)
      .map(day => {
        return {
          name: day,
          data: Object.entries(this.data.timeResponse[day])
            .sort(([timeA], [timeB]) => this.sortTime(timeA, timeB))
            .map(([time, value]) => {
              return {
                x: time,
                y: value
              };
            })
        };
      });
  }

  private sortDays(dayA: string, dayB: string): number {
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOrder.indexOf(dayB) - daysOrder.indexOf(dayA);
  }

  private sortTime(timeA: string, timeB: string): number {
    const parseTime = (time: string) => {
      const [hour, period] = time.split(/([^\d]+)/).filter(Boolean);
      return parseInt(hour, 10) + (period.toLowerCase() === 'pm' ? 12 : 0);
    };

    return parseTime(timeA) - parseTime(timeB);
  }

  mapOption: EChartsOption = {};

  mapFunction(): void {
    console.log(worldMap)
    echarts.registerMap('USA', worldMap, {
      Alaska: {
        left: -131,
        top: 25,
        width: 15
      },
      Hawaii: {
        left: -110,
        top: 28,
        width: 5
      },
      'Puerto Rico': {
        left: -76,
        top: 26,
        width: 2
      }
    });
    this.mapOption = {
      title: {
        text: 'Visitor By Country',
        left: 'middle'
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2
      },
      toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: {readOnly: false},
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: 'USA PopEstimates',
          type: 'map',
          roam: true,
          map: 'USA',
          emphasis: {
            label: {
              show: true
            }
          },
          data: [
            {name: 'Alabama', value: 4822023},
            {name: 'Alaska', value: 731449},
            {name: 'Arizona', value: 6553255},
            {name: 'Arkansas', value: 2949131},
            {name: 'California', value: 38041430},
            {name: 'Colorado', value: 5187582},
            {name: 'Connecticut', value: 3590347},
            {name: 'Delaware', value: 917092},
            {name: 'District of Columbia', value: 632323},
            {name: 'Florida', value: 19317568},
            {name: 'Georgia', value: 9919945},
            {name: 'Hawaii', value: 1392313},
            {name: 'Idaho', value: 1595728},
            {name: 'Illinois', value: 12875255},
            {name: 'Indiana', value: 6537334},
            {name: 'Iowa', value: 3074186},
            {name: 'Kansas', value: 2885905},
            {name: 'Kentucky', value: 4380415},
            {name: 'Louisiana', value: 4601893},
            {name: 'Maine', value: 1329192},
            {name: 'Maryland', value: 5884563},
            {name: 'Massachusetts', value: 6646144},
            {name: 'Michigan', value: 9883360},
            {name: 'Minnesota', value: 5379139},
            {name: 'Mississippi', value: 2984926},
            {name: 'Missouri', value: 6021988},
            {name: 'Montana', value: 1005141},
            {name: 'Nebraska', value: 1855525},
            {name: 'Nevada', value: 2758931},
            {name: 'New Hampshire', value: 1320718},
            {name: 'New Jersey', value: 8864590},
            {name: 'New Mexico', value: 2085538},
            {name: 'New York', value: 19570261},
            {name: 'North Carolina', value: 9752073},
            {name: 'North Dakota', value: 699628},
            {name: 'Ohio', value: 11544225},
            {name: 'Oklahoma', value: 3814820},
            {name: 'Oregon', value: 3899353},
            {name: 'Pennsylvania', value: 12763536},
            {name: 'Rhode Island', value: 1050292},
            {name: 'South Carolina', value: 4723723},
            {name: 'South Dakota', value: 833354},
            {name: 'Tennessee', value: 6456243},
            {name: 'Texas', value: 26059203},
            {name: 'Utah', value: 2855287},
            {name: 'Vermont', value: 626011},
            {name: 'Virginia', value: 8185867},
            {name: 'Washington', value: 6897012},
            {name: 'West Virginia', value: 1855413},
            {name: 'Wisconsin', value: 5726398},
            {name: 'Wyoming', value: 576412},
            {name: 'Puerto Rico', value: 3667084}
          ]
        }
      ]
    };

  }

  transformDataForBarChart() {
    const countriesData = Object.entries(this.data.countries)
      .filter(([, count]) => count as number > 5000);

    const categories = countriesData.map(([country]) => country);
    const data = countriesData.map(([, count]) => count as number);

    this.barChartOptions = {
      series: [
        {
          name: "basic",
          data: data
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories
      }
    };
  }

  transformDataForPieChart() {
    const filteredOperatingSystems = this.filterOutOperatingSystem(this.data.operatingSystems);

    this.pieChartOptions = {
      animationEnabled: true,
      title: {
        text: "Session by Operating System"
      },
      data: [{
        type: "doughnut",
        yValueFormatString: "#,###.##",
        indexLabel: "{name}",
        dataPoints: this.convertDataToDataPoints(filteredOperatingSystems)
      }]
    } as Partial<PieChartOptions>;
  }

  filterOutOperatingSystem(operatingSystems: { [key: string]: number }): { [key: string]: number } {
    const filteredOperatingSystems: { [key: string]: number } = {};
    Object.keys(operatingSystems).forEach(key => {
      if (key !== "Operating system") {
        filteredOperatingSystems[key] = operatingSystems[key];
      }
    });
    return filteredOperatingSystems;
  }

  convertDataToDataPoints(data: { [key: string]: number }): { y: number; name: string }[] {
    return Object.keys(data).map(key => ({y: data[key], name: key}));
  }

}
