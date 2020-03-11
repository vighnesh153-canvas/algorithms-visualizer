import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { ToastMessagesComponent } from './components/toast-messages/toast-messages.component';

import { SortingVisualizerComponent } from './algorithm-visualizer-components/sorting-visualizer/sorting-visualizer.component';
import {
  GridPathFindingVisualizerComponent
} from './algorithm-visualizer-components/grid-path-finding-visualizer/grid-path-finding-visualizer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    ToastMessagesComponent,
    SortingVisualizerComponent,
    GridPathFindingVisualizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
