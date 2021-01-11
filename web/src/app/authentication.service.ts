import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery: any;

export interface SearchPayload {
  from: string;
  to: string;
}

export interface Game {
  _id?: string;
  error?: string;
  rwd?: Date[];
  sessions?: Date[];
  ads?: number;
  id?: string;
  unit?: string;
  activity?: string;
  requests?: number;
  loaded?: number;
  rewarded?: number;
  failed?: number;
  clicked?: number;
  started?: number;
  name: string;
  bundle_id: string;
  mode?: string;
  date?: Date[];
  createdAt?: Date;
  platform?: string;
  reward?: number;
  interstitial?: number;
  rewards?: number;
  mediator?: Mediator;
}

export interface Mediator {
  id?: string;
  game: string;
  mediator: string;
  app_id: string;
  app_secret?: string;
  placement?: string;
  unit: string;
}

export interface Campaign {
  campaign_id?: string;
  game: string;
  game_name?: string;
  media: string;
  status: string;
  advertisor?: string;
  reward: number;
  budget: number;
  daily_budget: number;
}

export interface AdUnit {
  id?: string;
  game_name?: string;
  mediator_id: string;
  unit?: string;
  reward: number;
  placement?: string;
  platform?: string;
  mediator?: string;
  mode?: string;
  type: string;
}
export interface GamesPayload {
  game_id: number;
  game_name?: string;
}

export interface Wallet {
  address: string;
}

export interface Profile {
  id?: string;
  email: string;
  avatar?: string;
  name: string;
  user_id?: number;
  member_since?: Date;
}

export interface Balance {
  txId: string;
  balance: number;
  debit: number;
  credit: number;
  date: Date;
}

export interface UserDetails {
  _id: string;
  email: string;
  avatar?: string;
  type: string;
  name: string;
  exp?: number;
  iat?: number;
}

export interface PlayerDetails {
  _id: string;
  username?: string;
  mediator?: string;
  game_name?: string;
  player_id?: string;
  player_email: string;
  player_avatar?: string;
  player_name?: string;
  player_since?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  tx_id?: string;
  reward?: string;
}
export interface TokenResponse {
  token: string;
  refresh_token?: string;
}

export interface TokenPayload {
  email: string;
  type?: string;
  password: string;
  name?: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}
export interface GameSettings {
  rwd: number;
  game: string;
  publisher?: string;
  createdAt?: Date;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  public setToken(resp: TokenResponse): void {
    console.log(resp);
    this.saveToken(resp.token);
  }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public getUserType(): string {
    const user = this.getUserDetails();
    if (user) {
      return user.type;
    } else {
      return null;
    }
  }

  public isAdmin(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.type === 'admin';
    } else {
      return false;
    }
  }

  private request(method: any, type: string, data?: any): Observable<any> {
    let base;
    const headers = { headers: { Authorization: `Bearer ${this.getToken()}` } };
    if (method === 'post') {
      base = this.http.post(`/api/${type}`, data, headers);
    } else if (method === 'put') {
      base = this.http.put(`/api/${type}`, data, headers);
    } else if (method === 'delete') {
      base = this.http.delete(`/api/${type}`, headers);
    } else {
      base = this.http.get(`/api/${type}`, headers);
    }

    const request = base.pipe(
      map((rdata: any) => {
        console.log(rdata);
        if (! rdata) {
          console.log(this.getToken());
          console.log('YELLOW RUN');
          return false;
        }
        if (rdata.token) {
          this.saveToken(rdata.token);
        }
        return rdata;
      })
    );

    return request;
  }

  // Auth request for post

  private requestPostAuth<T>(type, rdata?: any): T {
    let base;
    const token = localStorage.getItem('mean-token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    base = this.http.post(`/api/${type}`, rdata, headers);
    const request = base.pipe(
      map((data: T) => data)
    );

    return request;
  }

  /* New Game Register by Publisher */
  public registerGame(g: Game): Observable<any> {
    console.log(g);
    if (g.id) {
      return this.editGame(g);
    } else {
      return this.requestPostAuth('publisher/game/create', g);
  }
}
  public editGame(g: Game): Observable<any> {
    return this.request('put' , 'publisher/game/' + g.id + '/update', g);
  }
  public deleteGame(gid: string): Observable<any> {
    return this.request('delete' , 'publisher/game/' + gid + '/delete');
  }
  public registerMediator(m: Mediator): Observable<any> {
    if (m.id) {
      return this.editMediator(m);
    }
    return this.requestPostAuth('publisher/mediation/create', m);
  }
  public registerCampaign(c: Campaign): Observable<any> {
    return this.requestPostAuth('advertiser/campaign/create', c);
  }
  public editMediator(m: Mediator): Observable<any> {
    return this.request('put' , 'publisher/mediation/' + m.id + '/update', m);
  }
  public deleteMediator(mid: string): Observable<any> {
    return this.request('delete' , 'publisher/mediation/' + mid + '/delete');
  }
  public registerAdUnit(a: AdUnit): Observable<any> {
    return this.requestPostAuth('publisher/adUnit/create', a);
  }

  public editAdUnit(a: AdUnit): Observable<any> {
    return this.request('put' , 'publisher/adUnit/' + a.unit + '/update', a);
  }
  public deleteAdUnit(au: string): Observable<any> {
    return this.request('delete' , 'publisher/adUnit/' + au + '/delete');
  }

  public signup(user: TokenPayload): Observable<any> {
    return this.request('post', 'publisher/create', user);
  }
  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }
  public changepass(changePass: ChangePassword): Observable<any> {
    return this.request('post', 'changePassword', changePass);
   }
  public profile(): Observable<any> {
    return this.request('get', this.getUserType() + '/profile');
  }

  public wallet(): Observable<any> {
    return this.request('get', this.getUserType() + '/wallet/address');
  }

  public walletRefresh(): Observable<any> {
    return this.request('get', this.getUserType() + '/wallet/refresh');
  }

  public getGame(gid: string): Observable<any> {
    return this.request('get', 'game/' + gid);
  }

  public getMediation(mid: string): Observable<any> {
    return this.request('get', 'mediation/' + mid);
  }

  public getAdunit(aid: string): Observable<any> {
    return this.request('get', 'adUnit/' + aid);
  }

  public getCampaign(cid: string): Observable<any> {
    return this.request('get', 'advertiser/campaign/' + cid);
  }

  public getCampaigns(): Observable<any> {
    return this.request('get', 'advertiser/campaign/list');
  }

  public getPublisherBalance(): Observable<any> {
    return this.request('get', 'publisher/balance');
  }

  public reset(): Observable<any> {
    return this.request('post', 'resetPassword');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public getFeaturedGame(): Observable<any> {
    /* Get the List of app featured/games */
    return this.request('get', this.getUserType() + '/featured/games');
  }

  public getTopGames(): Observable<any> {
    /* Get the List of app top/games */
    return this.request('get', this.getUserType() + '/top/games');
  }

  public getGameList(): Observable<any> {
    /* Get the List of app */
    return this.request('get', this.getUserType() + '/game/list');
  }
  public getGameStat(s: SearchPayload): Observable<any> {
    /* Get the List of games */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', this.getUserType() + '/game/stat?' + params.toString());
  }

  public getMediatorList(): Observable<any> {
    /* Get the List of app */
    return this.request('get', 'publisher/mediation/list');

  }

  public getadUnitList(): Observable<any> {
    /* Get the List of app */
    return this.request('get', 'publisher/adUnit/list');

  }

  public getGameListForPlayer(): Observable<any> {
    /* Get the List of app */
    return this.request('get', 'player/game/list');
  }
  public getPublisherList(): Observable<any> {
    /* Get the List of app */
    if (this.isAdmin()) {
      return this.request('get', 'admin/publisher/list');
    } else {
      return this.request('get', 'publisher/list');
    }
  }

  public getPlayerList(): Observable<any> {
    /* Get the List of app */
    return this.request('get', 'publisher/player/list');
  }

  public getRewardList(): Observable<any> {
    /* Get the List of rewards */
    return this.request('get', this.getUserType() + '/reward/list');
  }

  public getRewards(s: SearchPayload): Observable<any> {
    /* Get the List of games */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', this.getUserType() + '/reward/list?' + params.toString());
  }
  public getRewardsByStatus(t: string, s: SearchPayload): Observable<any> {
    /* Get the List of games */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', this.getUserType() + '/reward/' + t + '?' + params.toString());
  }

  public getCampaignActivity(s: SearchPayload): Observable<any> {
    /* Get the List of games */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', 'advertiser/campaign/activity?' + params.toString());
  }
  public getGameActivity(s: SearchPayload): Observable<any> {
    /* Get the List of games */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', this.getUserType() + '/game/activity?' + params.toString());
  }

  public getAdsActivity(s: SearchPayload): Observable<any> {
    /* Get the List of activity */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', '/publisher/ad/activity?' + params.toString());
  }

  public getAdsError(s: SearchPayload): Observable<any> {
    /* Get the List of activity */
    const params = new URLSearchParams();
    if (s) {
      params.set('from', s.from);
      params.set('to', s.to);
    }
    return this.request('get', '/publisher/ad/error?' + params.toString());
  }

  public getGameRewardList(game: string): Observable<any> {
    /* Get the List of rewards */
    return this.request('get', 'game/reward/list/' + game);
  }
  public getGamePlayerRewardList(player: string, game: string): Observable<any> {
    /* Get the List of rewards */
    if (game !== undefined) {
      return this.request('get', `player/${player}/${game}/reward/list`);
    } else {
      return this.request('get', `player/${player}/reward/list`);
    }
  }
  public getGamePlayerList(game: string): Observable<any> {
    /* Get the List of rewards */
    if (game !== undefined) {
      return this.request('get', 'game/player/list/' + game);
    } else {
      return this.request('get', 'admin/player/list');
    }
  }

  public getPlayerRewardList(): Observable<any> {
    /* Get the List of rewards */
    return this.request('get', 'player/reward/list/');
  }
  public getPublisherRewardList(): Observable<any> {
    /* Get the List of rewards */
    return this.request('get', 'publisher/reward/list/');
  }
  public getPublisherGameList(publisher: string): Observable<any> {
    /* Get the List of games */
    return this.request('get', 'publisher/games/list/' + publisher);
  }
  public getPageSize() {
    return 10;
  }
  public getPageSizeOptions(length: number) {
    const pageSize = this.getPageSize();
    let pages = length / pageSize;
    if (pages > pageSize) {
      pages += 1;
    }
    const options = [];
    for (let index = 1; index < pages; index++) {
      options.push(index * pageSize);
    }
    return options;
  }

  public makeSidebar() {
    (($) => {
      $(document).ready(() => {
        $('#sidebarCollapse').on('click', () => {
          $('#sidebar').toggleClass('active');
        });
        $('ul, li').disableSelection();

        $(window).on('scroll', () => {
          const wn = $(window).scrollTop();
          if (wn > 120) {
            $('header').css('background', 'rgba(0, 0, 0, 0.88)');
          } else {
            $('header').css('background', 'rgba(0, 0, 0, 0.5)');
          }
        });
      });
    })(jQuery);

  }

  public makeDatatable() {
    (($) => {
      $(document).ready(() => {
        const table = $('.datatable').DataTable({
          order: [],
          lengthChange: false,
          buttons: ['excel', 'pdf', 'colvis']
        });

        table.buttons().container()
          .appendTo('.col-md-6:eq(0)', table.table().container());
        $('.sortable').sortable({
          revert: true
        });
      });
    })(jQuery);

  }
  public loadDatatable(data) {
    (($) => {
      $(document).ready(() => {
        const table = $('.datatable').DataTable();
        table.clear();
        const dt = [];
        data.forEach(obj => {
          dt.push(Object.values(obj));
        });
        table.rows.add(dt);
        table.draw();
      });
    })(jQuery);

  }
}
