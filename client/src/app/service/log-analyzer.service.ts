import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class LogAnalyzerService {

  private makerRequestUrl: string = environment.localhost + "userLogs";

  constructor(private http: HttpClient) {
  }

  getWebLogs() {
    return this.http.get<any>(this.makerRequestUrl);
  }
}
