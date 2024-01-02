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

    const data = Object.keys(this.data.countries).map((name) => {
      return { name, value: this.data.countries[name] };
    });

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
          name: 'Visitor By Country',
          type: 'map',
          roam: true,
          map: 'USA',
          itemStyle: {
            emphasis: {
              areaColor: '#29e6f8',
            },
          },
          data: data
        }
      ]
    } as EChartsOption;

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
