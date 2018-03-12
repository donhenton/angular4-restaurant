

import { Injectable } from '@angular/core';
import { Restaurant } from './../model/restaurant.interface';
import * as postal from 'postal';


let _service: PubSubServiceImpl = null;


export const RESTAURANT_TOPIC = 'restaurant-topic'
export const CRUD_RESTAURANT_WILDCARD_TOPIC = '*.crud.' + RESTAURANT_TOPIC;
export const ADD_RESTAURANT_TOPIC = 'ADD.crud.' + RESTAURANT_TOPIC;
export const EDIT_RESTAURANT_TOPIC = 'EDIT.crud.' + RESTAURANT_TOPIC;
export const DELETE_RESTAURANT_TOPIC = 'DELETE.crud.' + RESTAURANT_TOPIC;
export const COMMIT_RESTAURANT_WILDCARD_TOPIC = '*.commit.topic.' + RESTAURANT_TOPIC;
export const ADD_RESTAURANT_COMMIT_TOPIC = 'ADD.commit.topic.' + RESTAURANT_TOPIC;
export const SAVE_RESTAURANT_COMMIT_TOPIC = 'SAVE.commit.topic.' + RESTAURANT_TOPIC;
export const DELETE_RESTAURANT_COMMIT_TOPIC = 'DELETE.commit.topic.' + RESTAURANT_TOPIC;

export const REVIEW_TOPIC = 'review-topic';
export const COMMIT_REVIEW_WILDCARD_TOPIC = '*.commit.topic.' + REVIEW_TOPIC;
export const ADD_REVIEW_COMMIT_TOPIC = 'ADD.commit.topic.' + REVIEW_TOPIC;
export const SAVE_REVIEW_COMMIT_TOPIC = 'SAVE.commit.topic.' + REVIEW_TOPIC;
export const DELETE_REVIEW_COMMIT_TOPIC = 'DELETE.commit.topic.' + REVIEW_TOPIC;
export const REFRESH_REVIEW_TOPIC = 'refresh.review.topic';



export const FEEDBACK_TOPIC = 'feedback.topic';
export const WAIT_TOPIC = 'wait.topic';
export const REFRESH_RESTAURANT_TOPIC = 'refresh.restaurant.topic';


@Injectable()
export class PubSubService {


    private service: PubSubServiceImpl
    constructor() {

        if (_service === null) {
            _service = new PubSubServiceImpl();

        }

    }

    getService(): PubSubServiceImpl {
        return _service;
    }

}
export default class Garbage {

}

export interface PubSubSystem {
    getChannel(): IChannelDefinition<any>;



}


class PubSubServiceImpl implements PubSubSystem {


    private RESTAURANT_CHANNEL = 'restaurant-channel'
    constructor() {



    }


    public getChannel(): IChannelDefinition<any> {
        return postal.channel(this.RESTAURANT_CHANNEL);
    }



}

