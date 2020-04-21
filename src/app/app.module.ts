import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './admin/users/users.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { BlogComponent } from './blog/blog.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ConfirmDialogComponent,
    UsersComponent,
    LogoutComponent,
    BlogComponent,
    NavigationComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
