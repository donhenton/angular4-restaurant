import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RestaurantComponent } from './components/restaurant-component';
import { EditRestaurantContainer } from './components/edit-restaurant-container';
import { EditReviewDTOContainer } from './components/edit-reviewDTO-container';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RestaurantService } from './services/restaurant.service';
import { RestaurantActionService } from './services/restaurant-action.service';
import { PubSubService } from './services/pubsub.service';
import { RestaurantList } from './components/restaurant-list';
import { WaitIndicator } from './components/wait-indicator';
import { RestaurantListRow } from './components/restaurant-list-row';
import { ReviewListRow } from './components/review-list-row';
import { AppendPipe } from './pipes/append-pipe';

@NgModule({
    imports: [
        BrowserModule, FormsModule, ReactiveFormsModule, HttpModule
    ],

    declarations: [RestaurantComponent, RestaurantList, WaitIndicator, EditReviewDTOContainer,
        EditRestaurantContainer, RestaurantListRow, ReviewListRow, AppendPipe],
    providers: [RestaurantService, PubSubService, RestaurantActionService],
    bootstrap: [RestaurantComponent]
})
export class AppModule {
}
