import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

import { SortingVisualizerComponent } from './algorithm-visualizer-components/sorting-visualizer/sorting-visualizer.component';
import {
  GridPathFindingVisualizerComponent
} from './algorithm-visualizer-components/grid-path-finding-visualizer/grid-path-finding-visualizer.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'sorting-visualizer', component: SortingVisualizerComponent },
  { path: 'grid-path-finder', component: GridPathFindingVisualizerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
