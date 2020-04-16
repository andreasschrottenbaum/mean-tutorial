import { Component, ViewChild } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, Event, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('drawer') drawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    // Close the navigation drawer on handsets after router change
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (window.matchMedia(Breakpoints.Handset).matches) {
          this.drawer.close();
        }
      }
    });
  }

  // copy/pasted from angular.io
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
