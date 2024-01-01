import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LogAnalyzerComponent} from "./home/log-analyzer/log-analyzer.component";
import {LogAnalyzerService} from "./service/log-analyzer.service";
import {JsonPipe} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {NgApexchartsModule} from "ng-apexcharts";
import {NgxEchartsModule} from "ngx-echarts";
import * as echarts from 'echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";

@NgModule({
  declarations: [
    AppComponent,
    LogAnalyzerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JsonPipe,
    NgApexchartsModule,
    NgxEchartsModule.forRoot({ echarts }),
    CanvasJSAngularChartsModule,
    NgbModule,
  ],
  providers: [LogAnalyzerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
