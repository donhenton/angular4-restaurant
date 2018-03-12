import { Component, OnInit } from '@angular/core';
import { RestaurantList } from './restaurant-list'
import { EditRestaurantContainer } from './edit-restaurant-container'
import { EditReviewDTOContainer } from './edit-reviewDTO-container'
import { RestaurantActionService } from './../services/restaurant-action.service';
import { WaitIndicator } from './wait-indicator';
import { PubSubService, PubSubSystem } from './../services/pubsub.service';
import { FeedbackMessage, messageType } from './../model/restaurant.interface';
import * as postal from 'postal';
import { FEEDBACK_TOPIC } from './../services/pubsub.service'
import { AppendPipe } from './../pipes/append-pipe';

@Component({
  selector: 'restaurant-component',
  styles: [`

     .restaurantApp   #mainDisplayMessage {
       font-size: 20px;
       margin: 20px;
       border: thin solid #ddd;
       height: 40px;
       padding: 5px;
      }

    .restaurantApp   #mainDisplayMessage.info {
      color: blue; }
    .restaurantApp   #mainDisplayMessage.error {
      color: red; }



  `],
  template: `


    <div id="reactRestaurantContainer">
        <div class="restaurantApp grouping">
            <wait-indicator [isProcessing]="true"></wait-indicator>
            <div [ngClass]="getMessageClass(displayMessage.type)"
            id="mainDisplayMessage">
                <span *ngIf="displayMessage.show">{{displayMessage.message |appendPipe |uppercase }}</span>

            </div>
            <restaurant-list></restaurant-list>
            <div id="editControlGroup" class="grouping">
                    <edit-restaurant-container></edit-restaurant-container>
                    <edit-reviewDTO-container></edit-reviewDTO-container>
            </div>




        </div>



    </div>


  `
})
export class RestaurantComponent implements OnInit {

  public displayMessage: FeedbackMessage;
  private sub: PubSubSystem;
  private subscriptions: ISubscriptionDefinition<any>[] = [];

  constructor(private subProvider: PubSubService, private actionProvider: RestaurantActionService) {

    this.displayMessage = <FeedbackMessage>{};
    this.displayMessage.message = '';
    this.displayMessage.type = messageType.info;
    this.displayMessage.show = false;
    this.sub = subProvider.getService();
    const s1 = this.sub.getChannel().subscribe(FEEDBACK_TOPIC,
      (data: any, envelope: IEnvelope<any>) => this.handleFeedback(data, envelope));

  }

  ngOnInit() {



  }

  getMessageClass(type: messageType) {
    if (type === messageType.info) {
      return 'info';

    }
    if (type === messageType.error) {
      return 'error';
    }
    return 'unknown'
  }


  handleFeedback(data: FeedbackMessage, evelope: IEnvelope<any>) {

    this.displayMessage = data;


  }

}
