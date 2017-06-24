import {PubSubService,  PubSubSystem } from './../services/pubsub.service';
import { WaitRequest } from './../model/restaurant.interface';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { WAIT_TOPIC } from './../services/pubsub.service'

@Component({
  selector: 'wait-indicator',
  template: `
   
  <div [class.waitIndicator]="isProcessing">
      
  </div>
 
  
  `
})
export class WaitIndicator {


  @Input() isProcessing: boolean = false;

  private sub: PubSubSystem;
  private waitSubscription: ISubscriptionDefinition<any>;
  constructor(private subProvider: PubSubService) {

    this.sub = subProvider.getService();




  }

  ngOnInit() {
    this.waitSubscription = this.sub.getChannel().subscribe(WAIT_TOPIC,
      (data: WaitRequest, envelope: IEnvelope<any>) => this.handleRequest(data, envelope));
  }


  ngOnDestroy() {
    if (this.waitSubscription) {
      this.waitSubscription.unsubscribe();
      this.waitSubscription = null;
    }
  }


  handleRequest(data: WaitRequest, envelope: IEnvelope<any>) {
    this.isProcessing = data.state;
  }

}

