import { Component, ViewChildren, Renderer, Inject } from '@angular/core';
import { Restaurant } from './../model/restaurant.interface';
import { RestaurantService } from './../services/restaurant.service';
import { RestaurantListRow } from './restaurant-list-row';
import {PubSubService, PubSubSystem } from './../services/pubsub.service';
import { WaitRequest, RefreshMessage } from './../model/restaurant.interface';
import * as postal from 'postal';
import { DELETE_RESTAURANT_COMMIT_TOPIC,REFRESH_RESTAURANT_TOPIC,CRUD_RESTAURANT_WILDCARD_TOPIC, WAIT_TOPIC, 
    ADD_RESTAURANT_TOPIC, DELETE_RESTAURANT_TOPIC, EDIT_RESTAURANT_TOPIC, REFRESH_REVIEW_TOPIC
} from './../services/pubsub.service'

@Component({
    selector: 'restaurant-list',
    template: `
   
   
<div class="restaurantListContainer">
<button (click)="performAdd($event)" class="editButton addButton" >Add Record</button>
    <div id="restaurantScrollList">
        <div id="tHeadContainer" data-reactid=".0.1.1.0">
            <table>
                <tbody>
                    <tr>
                        <th class="nameItem">Name</th>
                        <th class="cityItem">City</th>
                        <th class="stateItem">State</th>
                        <th class="zipCodeItem">Zip Code</th>
                        <th class="versionItem">Version</th>
                        <th class="actionItems">&nbsp;</th>
                        <th class="actionItems">&nbsp;</th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="tbodyContainer">
            <table>
                <tbody>
                  <tr  [attr.data-id]="row.id" [ngClass]="getRowClass(row.id)" *ngFor="let row of this.restaurantList">
                  <restaurant-list-row [row]="row"   (edit-event)="onEditChangeEvent($event)" ></restaurant-list-row>
                  </tr>
                </tbody>
            </table>

        </div>



    </div>
</div>
  
  `
})
export class RestaurantList {

    private isLoading: boolean = false;
    private restaurantList: Restaurant[];// cannot place in constructor for some reason
    private doRoll: boolean = false;
    private selectedRowId = -1;
    private crudSubscription: ISubscriptionDefinition<any>;
    private refreshSubscription: ISubscriptionDefinition<any>;
    private subscriptions: ISubscriptionDefinition<any>[] = [];
    private sub: PubSubSystem;



    @ViewChildren(RestaurantListRow) rowItems: RestaurantListRow[];

    constructor(private restaurantService: RestaurantService, @Inject(Renderer) private renderer: Renderer,
        private subProvider: PubSubService, ) {
        this.sub = subProvider.getService();
        this.restaurantList = [];
        this.crudSubscription = this.sub.getChannel().subscribe(CRUD_RESTAURANT_WILDCARD_TOPIC,
            (data: any, envelope: IEnvelope<any>) => this.handleCrudOperation(data, envelope));
        this.refreshSubscription = this.sub.getChannel().subscribe(REFRESH_RESTAURANT_TOPIC,
            (data: any, envelope: IEnvelope<any>) => this.handleRefresh(data, envelope));

        let s1 = this.sub.getChannel().subscribe(REFRESH_REVIEW_TOPIC,
            (data: any, envelope: IEnvelope<any>) => this.handleReviewRefresh(data.selectedRestaurant, envelope));

        this.subscriptions.push(this.crudSubscription);
        this.subscriptions.push(this.refreshSubscription);
        this.subscriptions.push(s1);

    }

    handleReviewRefresh(data:Restaurant, envelope:IEnvelope<any>)
    {
         let t =      this.restaurantList.map( (res) => {
            if (res.id == data.id)
            {
                console.log("refreshing reviews in list")
                res = {...data};
            }
            return res;
           


        })   

        this.restaurantList = <Restaurant[]>t;
    }

    handleCrudOperation(data: any, envelope: IEnvelope<any>) {
      //  console.log("in restaurant-list handleCrud " + envelope.topic + " not needed ");
    }
    handleRefresh(data: RefreshMessage, envelope: IEnvelope<any>) {
        // console.log("in restaurant-list refresh " + JSON.stringify(envelope));
        console.log('got refresh message')
        if (data.selectedRestaurantId) {
            //if this is an add, roll
            this.selectedRowId = data.selectedRestaurantId;


        }
        this.ngOnInit();
    }


    getRowClass(rowId) {
        var classString = "restaurantRow";
        if (rowId === this.selectedRowId) {
            classString += " highLighted"
        }
        return classString;
    }

    ngAfterViewChecked() {

        if (this.rowItems && this.selectedRowId > -1 && this.doRoll) {
            let activeRow = this.rowItems.filter(r => {
                return r.row.id === this.selectedRowId;
            })
            if (activeRow && activeRow.length == 1) {
                //console.log("did the scroll")
                this.renderer.invokeElementMethod(activeRow[0].getDom(), 'scrollIntoView', [{
                    behavior: "smooth",
                    block: "start",
                }]);
                //console.log("xxx "+activeRow[0].row.name)
                this.doRoll = false;
            }
            else {
                //console.log("active row not found")
                this.doRoll = false;
            }

        }

    }

    ngOnDestroy() {

        this.subscriptions.forEach(s => {
            if (s) {
                
                s.unsubscribe();
                s = null;
            }
        })

    }
    sendWait(state: boolean) {
        var waitMessage = <WaitRequest>{};
        waitMessage.state = state;
        this.sub.getChannel().publish(WAIT_TOPIC, waitMessage);
    }

    ngOnInit() {


        this.restaurantService.getAllRestaurants()
            .subscribe(json => {
                this.isLoading = false;
                this.restaurantList = [];
                json.forEach(j => {

                    this.restaurantList.push(j)

                })

                this.sendWait(false);


                if (this.selectedRowId && this.selectedRowId > 0) {
                    //you are coming in on an ADD so roll the window
                    this.doRoll = true;
                    //console.log("doing an add so roll")
                }




            }, error => {

                this.isLoading = false;
                console.error(error);
                this.sendWait(false);


            });

    }

    onEditChangeEvent(ev) {

        var message = null;

        this.selectedRowId = ev.selectedRestaurant.id;

        if (ev.type === 'delete') {

            var confirmMessage = 'Do you want to delete "' + ev.selectedRestaurant.name + '" ?'
            var confirm = window.confirm(confirmMessage);
            if (confirm && confirm === true) {
                this.signalCRUDEvent("DELETE", ev);
            }

        }
        else {
            this.signalCRUDEvent("EDIT", ev);

        }



    }

    signalCRUDEvent(type: string, payload: any) {
        let topic = null;
        if (type === 'ADD') {
            topic = ADD_RESTAURANT_TOPIC;
        }
        if (type === 'EDIT') {
            topic = EDIT_RESTAURANT_TOPIC;
        }
        if (type === 'DELETE') {
            topic = DELETE_RESTAURANT_COMMIT_TOPIC;
        }
        this.sub.getChannel().publish(topic, payload);
    }


    performAdd() {
        let emptyRestaurant = <Restaurant>{};
        emptyRestaurant.id = -1;
        emptyRestaurant.version = 1;
        emptyRestaurant.name = "";
        emptyRestaurant.city = "";
        emptyRestaurant.state = "";
        emptyRestaurant.zipCode = "";
        this.signalCRUDEvent("ADD", {selectedRestaurant: emptyRestaurant});


    }




}