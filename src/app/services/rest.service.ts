import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, catchError, tap, retry} from 'rxjs/operators';
import {AppConfigService} from '../services/app-config.service';
import {IAuth} from '../interfaces/iauth';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    endpoint = AppConfigService.settings.apiServer.rest;
    loggingEnabled = AppConfigService.settings.logging.enabled;

    public loggedin: boolean = false;
    public alpdesk_token: string = '';
    public alpdesk_username: string = '';

    constructor(private http: HttpClient) {
    }

    log(message: any) {
        if (this.loggingEnabled) {
            console.log(message);
        }
    }

    public handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.log(error);
            return of(result as T);
        };
    }

    setSessionData(iAuth: IAuth) {
        this.alpdesk_token = iAuth.alpdesk_token;
        this.alpdesk_username = iAuth.username;
        this.loggedin = true;
    }

    resetSessionData() {
        this.alpdesk_token = '';
        this.alpdesk_username = '';
        this.loggedin = false;
    }

    login(username: string, password: string): Observable<IAuth> {
        const sysJson = JSON.stringify({username, password});
        const options = {
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        };
        return this.http.post<any>(this.endpoint + '/auth', sysJson, options).pipe(
            retry(1), catchError(this.handleError<IAuth[]>('login', undefined))
        );
    }

    logout(): Observable<IAuth> {
        const options = {
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + this.alpdesk_token)
        };
        return this.http.post<any>(this.endpoint + '/auth/logout', '', options).pipe(
            retry(1), catchError(this.handleError<IAuth[]>('auth/logout', undefined))
        );
    }

    verify(): Observable<IAuth> {
        const options = {
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + this.alpdesk_token)
        };
        return this.http.post<any>(this.endpoint + '/auth/verify', '', options).pipe(
            retry(1), catchError(this.handleError<IAuth[]>('auth/verify', undefined))
        );
    }

    private call(message: any): Observable<any> {
        const options = {
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + this.alpdesk_token)
        };
        const sysJson = JSON.stringify({data: message.data});
        this.log(sysJson);
        return this.http.post<any>(this.endpoint + message.path, sysJson, options).pipe(
            retry(1), catchError(this.handleError<any[]>('call', undefined))
        );
    }

    mandant(): Observable<any> {
        return this.call({path: '/mandant', data: []});
    }

    plugin(name: string, data: any): Observable<any> {
        const options = {
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + this.alpdesk_token)
        };
        const sysJson = JSON.stringify({plugin: name, data: data});
        this.log(sysJson);
        return this.http.post<any>(this.endpoint + '/plugin', sysJson, options).pipe(
            retry(1), catchError(this.handleError<any[]>('call', undefined))
        );
    }

    async finder(data: any): Promise<any> {
        const options = {
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + this.alpdesk_token)
        };
        this.log(data);
        return this.http.post<any>(this.endpoint + '/finder', data, options).pipe(
            retry(1), catchError(this.handleError<any[]>('call', undefined))
        ).toPromise();
    }

    upload(formData: FormData) {
        this.log(formData);
        return this.http.post<any>(this.endpoint + '/upload', formData, {
            headers: new HttpHeaders().append('Authorization', 'Bearer ' + this.alpdesk_token),
            reportProgress: true,
            observe: 'events'
        });
    }

    download(path: string) {
        const sysJson = JSON.stringify({target: path});
        this.log(sysJson);
        return this.http.post<Blob>(this.endpoint + '/download', sysJson, {
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + this.alpdesk_token),
            observe: 'response',
            responseType: 'blob' as 'json'
        }).pipe(
            retry(1), catchError(this.handleError<any[]>('call', undefined))
        );
    }

}
