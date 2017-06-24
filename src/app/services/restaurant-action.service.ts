import {PubSubService,  PubSubSystem } from './pubsub.service';
import { RestaurantService } from './restaurant.service';
import { WaitRequest, Restaurant, messageType, RefreshMessage, ReviewDTO, ReviewPayload } from './../model/restaurant.interface';
import { Injectable } from '@angular/core';
import FeedbackMessageImpl from './../model/FeedbackMessageImpl';
import {
    DELETE_RESTAURANT_TOPIC, FEEDBACK_TOPIC, REFRESH_RESTAURANT_TOPIC, EDIT_RESTAURANT_TOPIC,
    COMMIT_RESTAURANT_WILDCARD_TOPIC, WAIT_TOPIC,REFRESH_REVIEW_TOPIC,
    COMMIT_REVIEW_WILDCARD_TOPIC
} from './../services/pubsub.service'


@Injectable()
export class RestaurantActionService {


    private sub: PubSubSystem;

    constructor(private restaurantService: RestaurantService,
        private subProvider: PubSubService) {

        this.sub = subProvider.getService();

        this.sub.getChannel().subscribe(COMMIT_RESTAURANT_WILDCARD_TOPIC, (data, envelope: IEnvelope<any>) => {

            let action = envelope.topic.split(".")[0];
            // console.log(`got action ${action} in restaurant-action-service`)
            if (action === "ADD") {
                this.handleAdd(data);
            }
            if (action === "SAVE") {
                this.handleSave(data);
            }
            if (action === "DELETE") {
                this.handleDelete(data);
            }



        });

        this.sub.getChannel().subscribe(COMMIT_REVIEW_WILDCARD_TOPIC, (data: ReviewPayload, envelope: IEnvelope<any>) => {

            let action = envelope.topic.split(".")[0];


            if (action === "SAVE") {
                this.handleReviewSave(data);
            }
            if (action === "ADD") {
                this.handleReviewAdd(data);
            }
            if (action === "DELETE") {
                this.handleReviewDelete(data);
            }



        });

    }

    sendWait(state: boolean) {
        var waitMessage = <WaitRequest>{};
        waitMessage.state = state;
        this.sub.getChannel().publish(WAIT_TOPIC, waitMessage);
    }

    sendFeedback(f: FeedbackMessageImpl) {
        this.sub.getChannel().publish(FEEDBACK_TOPIC, f);
    }

    sendRestaurantRefresh(refreshRequest) {
        this.sub.getChannel().publish(REFRESH_RESTAURANT_TOPIC, refreshRequest);
    }


    handleDelete(data) {

        this.restaurantService.deleteRestaurant(data.selectedRestaurant).subscribe(

            () => {


                this.sendWait(true);

                let f = new FeedbackMessageImpl();
                f.message = "Restaurant Deleted";
                f.show = true;
                f.type = messageType.info;
                this.sendFeedback(f);
                this.sendRestaurantRefresh({ doRefresh: true, selectedRestaurantId: null });
                this.sub.getChannel().publish(DELETE_RESTAURANT_TOPIC, {});


            },
            err => { console.log(JSON.stringify(err)) }

        )
    }

    handleAdd(data) {
        let f = new FeedbackMessageImpl();
        f.message = "Restaurant Added";
        f.show = true;
        f.type = messageType.info;
        this.sendWait(true);
        this.restaurantService.addRestaurant(data).subscribe(

            (idInfo) => {
                this.sendFeedback(f);
                this.sendRestaurantRefresh({ doRefresh: true, selectedRestaurantId: idInfo.id })
                let newItem: Restaurant = { ...data };
                newItem.id = idInfo.id;
                this.sub.getChannel().publish(EDIT_RESTAURANT_TOPIC, { selectedRestaurant: newItem })

            },
            err => { console.log(JSON.stringify(err)) }

        )
    }



    handleSave(data) {

        let f = new FeedbackMessageImpl();
        f.message = "Save completed";
        f.show = true;
        f.type = messageType.info;
        this.sendWait(true)
        this.restaurantService.saveResaurant(data).subscribe(

            () => {
                this.sendFeedback(f);
                this.sendRestaurantRefresh({ doRefresh: true, selectedRestaurantId: data.id })
            },
            err => { console.log(JSON.stringify(err)) }

        )



    }

    ///// reviews /////////////////////////////////////////


    sendReviewRefresh(restaurantId: number,feedback:string) {
        let f = new FeedbackMessageImpl();
        f.message = feedback;
        f.show = true;
        f.type = messageType.info;
        this.restaurantService.getRestaurant(restaurantId + "").subscribe(

            (data) => {
                this.sendFeedback(f);
                this.sub.getChannel().publish(REFRESH_REVIEW_TOPIC,{selectedRestaurant:data})

            },
            err => {
                console.log(JSON.stringify(err));
                this.sendWait(false);
            }

        )

    }


    handleReviewAdd(data: ReviewPayload) {
        this.sendWait(true);
        this.restaurantService.addReview(data).subscribe(

            () => {
                 
                this.sendReviewRefresh(data.restaurantId,"Review Added");

            },
            err => { console.log(JSON.stringify(err)) }

        )

    }

    handleReviewDelete(data: ReviewPayload) {
        this.sendWait(true);
        this.restaurantService.deleteReview(data).subscribe(

            () => {
                 
                this.sendReviewRefresh(data.restaurantId,"Review Deleted");

            },
            err => { console.log(JSON.stringify(err)) }

        )


    }


    handleReviewSave(data: ReviewPayload) {
        
        this.sendWait(true)
        this.restaurantService.saveReview(data).subscribe(

            () => {
                 
                this.sendReviewRefresh(data.restaurantId,"Review Saved");

            },
            err => { console.log(JSON.stringify(err)) }

        )
    }


}