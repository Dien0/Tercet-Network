import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './reset/reset.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { GuestLayoutComponent } from './guest-layout/guest-layout.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { NewMediatorComponent } from './new-mediator/new-mediator.component';
import { NewAdUnitComponent } from './new-ad-unit/new-ad-unit.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MediatorsComponent } from './mediators/mediators.component';
import { AdUnitsComponent } from './ad-units/ad-units.component';
import { GamesComponent } from './games/games.component';
import { NewGameComponent } from './new-game/new-game.component';
import { RewardsComponent } from './rewards/rewards.component';
import { PlayersComponent } from './players/players.component';
import { BalanceComponent } from './balance/balance.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { TopGamesComponent } from './top-games/top-games.component';
import { WalletComponent } from './wallet/wallet.component';
import { GameRewardsComponent } from './game-rewards/game-rewards.component';
import { FeaturedGamesComponent } from './featured-games/featured-games.component';
import { DateSearchComponent } from './date-search/date-search.component';
import { GameActivityComponent } from './game-activity/game-activity.component';
import { CampaignComponent } from './campaign/campaign.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { CampaignActivityComponent } from './campaign-activity/campaign-activity.component';
import { AdActivityComponent } from './ad-activity/ad-activity.component';
import { AdErrorComponent } from './ad-error/ad-error.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetComponent,
    SignupComponent,
    ProfileComponent,
    GuestLayoutComponent,
    DashboardLayoutComponent,
    NewMediatorComponent,
    NewAdUnitComponent,
    SidebarComponent,
    MediatorsComponent,
    AdUnitsComponent,
    NewGameComponent,
    GamesComponent,
    RewardsComponent,
    PlayersComponent,
    BalanceComponent,
    ChangePassComponent,
    TopGamesComponent,
    WalletComponent,
    GameRewardsComponent,
    FeaturedGamesComponent,
    DateSearchComponent,
    GameActivityComponent,
    CampaignComponent,
    NewCampaignComponent,
    CampaignActivityComponent,
    AdActivityComponent,
    AdErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthenticationService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
