import {Component, ViewChild} from '@angular/core';
import {LogAnalyzerService} from "../../service/log-analyzer.service";
import {ChartComponent} from "ng-apexcharts";

export type ChartOptions = {
  series?: any;
  chart?: any;
  dataLabels?: any;
  title?: any;
  colors?: any;
};

@Component({
  selector: 'app-log-analyzer',
  templateUrl: './log-analyzer.component.html',
  styleUrls: ['./log-analyzer.component.scss']
})
export class LogAnalyzerComponent {


  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

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
        text: "HeatMap Chart (Single color)"
      }
    };
  }

  ngOnInit(): void {
    this.logAnalyzerService.getWebLogs().subscribe(
      (data: any) => {
        this.data = data;
        this.transformDataForChart();
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

}
