import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LogAnalyzerComponent} from "./home/log-analyzer/log-analyzer.component";
import {LogAnalyzerService} from "./service/log-analyzer.service";
import {JsonPipe} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {NgApexchartsModule} from "ng-apexcharts";

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
    NgApexchartsModule
  ],
  providers: [LogAnalyzerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
