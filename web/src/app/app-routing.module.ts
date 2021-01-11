import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './reset/reset.component';
import { ProfileComponent } from './profile/profile.component';
import { GuestLayoutComponent } from './guest-layout/guest-layout.component';
import { AuthGuardService } from './auth-guard.service';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { NewAdUnitComponent } from './new-ad-unit/new-ad-unit.component';
import { NewMediatorComponent } from './new-mediator/new-mediator.component';
import { MediatorsComponent } from './mediators/mediators.component';
import { AdUnitsComponent } from './ad-units/ad-units.component';
import { NewGameComponent } from './new-game/new-game.component';
import { GamesComponent } from './games/games.component';
import { RewardsComponent } from './rewards/rewards.component';
import { PlayersComponent } from './players/players.component';
import { BalanceComponent } from './balance/balance.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { WalletComponent } from './wallet/wallet.component';
import { GameRewardsComponent } from './game-rewards/game-rewards.component';
import { FeaturedGamesComponent } from './featured-games/featured-games.component';
import { TopGamesComponent } from './top-games/top-games.component';
import { GameActivityComponent } from './game-activity/game-activity.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CampaignActivityComponent } from './campaign-activity/campaign-activity.component';
import { AdActivityComponent } from './ad-activity/ad-activity.component';
import { AdErrorComponent } from './ad-error/ad-error.component';


const routes: Routes = [
  { path: '', component: DashboardLayoutComponent,
children: [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'wallet/address', component: WalletComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'balance', component: BalanceComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'new-game', component: NewGameComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'new-campaign', component: NewCampaignComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'edit-game/:gid', component: NewGameComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'edit-campaign/:cid', component: NewCampaignComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'new-mediation', component: NewMediatorComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'edit-mediation/:mid', component: NewMediatorComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'new-adUnit', component: NewAdUnitComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: 'edit-adUnit/:aid', component: NewAdUnitComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always', },
  { path: '', component: GameRewardsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'games-stat', component: GameRewardsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'game-reward', component: GameRewardsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'change-pass', component: ChangePassComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'featured-games', component: FeaturedGamesComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'top-games', component: TopGamesComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'campaigns', component: CampaignComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'games', component: GamesComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'campaign-activity', component: CampaignActivityComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'game-activity', component: GameActivityComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'mediation-activity', component: AdActivityComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'mediation-error', component: AdErrorComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'players', component: PlayersComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'rewards/:list', component: RewardsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'mediations', component: MediatorsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  { path: 'adUnits', component: AdUnitsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'}
] },
{ path: '', component: GuestLayoutComponent,
  children: [
  { path: 'signin', component: LoginComponent },
  { path: 'forgot', component: ResetComponent },
  { path: 'signup', component: SignupComponent }
]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
