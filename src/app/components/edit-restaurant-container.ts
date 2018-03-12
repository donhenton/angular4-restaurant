// tslint:disable:max-line-length
import { Component, OnDestroy } from '@angular/core';
import { Restaurant } from './../model/restaurant.interface';
import { RestaurantService } from './../services/restaurant.service';
import {PubSubService,  PubSubSystem } from './../services/pubsub.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CRUD_RESTAURANT_WILDCARD_TOPIC, WAIT_TOPIC , ADD_RESTAURANT_COMMIT_TOPIC,
    SAVE_RESTAURANT_COMMIT_TOPIC} from './../services/pubsub.service'




@Component({
    selector: 'edit-restaurant-container',
    template: `
  <section [hidden]="backUp === null" class="editRestaurantContainer">
<form id="editForm" [formGroup]="editForm">
<input type="hidden" formControlName="id" >
<table class="editTable">
<tbody>
<tr>
<th>Name: </th>
<td>
<input type="text" formControlName="name" class="inputName" value="" >
</td>
<th>City: </th>
<td>
<input   type="text" formControlName="city" class="inputCity" value="">
</td>
</tr>
<tr><th>State: </th>
<td><input type="text" formControlName="state" class="inputState" value="" ></td>
<th>ZipCode:</th>
<td>
<input type="text" formControlName="zipCode" class="inputZipCode" value=""></td>
</tr>
<tr>
<th>Version:</th>
<td>
<select formControlName="version">
<option value="1">1</option>
<option selected="" value="2">2</option>
<option value="3">3</option>
</select>
</td>

</tr>
<tr>
<td><button (click)="cancelAction($event)"   class="warnButton">Cancel</button></td>
<td><button (click)="saveAction($event)" [class.inactive] = "!this.editForm.valid || this.equalToBackup()"   class="editButton">Save</button></td>
<td colspan='2'>
 
  <div *ngIf="!editForm.valid && !editForm.pristine">

<div *ngIf="!editForm.valid">
        <div class="red-color errorInfo" *ngIf="editForm.controls.name.errors && editForm.controls.name.errors.minlength">The name must be {{editForm.controls.name.errors.minlength.requiredLength}} chars long</div>
        <div class="red-color errorInfo" *ngIf="editForm.controls.city.errors && editForm.controls.city.errors.minlength">The city must be {{editForm.controls.city.errors.minlength.requiredLength}} chars long</div>
        <div class="red-color errorInfo" *ngIf="editForm.controls.state.errors && editForm.controls.state.errors.minlength">The state must be {{editForm.controls.state.errors.minlength.requiredLength}} chars long</div>
        <div class="red-color errorInfo" *ngIf="editForm.controls.zipCode.errors && editForm.controls.zipCode.errors.minlength">The zipCode must be {{editForm.controls.zipCode.errors.minlength.requiredLength}} chars long</div>

        <div class="red-color errorInfo" *ngIf="editForm.controls.name.errors && editForm.controls.name.errors.required">The name is required</div>
        <div class="red-color errorInfo" *ngIf="editForm.controls.city.errors && editForm.controls.city.errors.required">The city is required</div>
        <div class="red-color errorInfo" *ngIf="editForm.controls.state.errors && editForm.controls.state.errors.required">The state is required</div>
        <div class="red-color errorInfo" *ngIf="editForm.controls.zipCode.errors && editForm.controls.zipCode.errors.required">The zipCode is required</div>



</div>




  </div>
</td>
</tr>
</tbody>
</table>
</form>
</section>


  `
})
//http://blog.ng-book.com/the-ultimate-guide-to-forms-in-angular-2/
export class EditRestaurantContainer implements OnDestroy {




    private sub: PubSubSystem;
    public backUp: Restaurant = null;
    private actionState: string = null;
    public editForm: FormGroup;
    private crudRequestSubscription: ISubscriptionDefinition<any>;


    constructor(private restaurantService: RestaurantService,
        private subProvider: PubSubService, fb: FormBuilder) {
      //  console.log("in restaurant con")
        this.sub = subProvider.getService();
        this.editForm = fb.group({
            city: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            state: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            zipCode: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            version: [1, Validators.required],
            id: [-1]




        })



        this.crudRequestSubscription = this.sub.getChannel().subscribe(CRUD_RESTAURANT_WILDCARD_TOPIC,
            (data: any, envelope: IEnvelope<any>) => this.handleCrudOperation(data, envelope));


    }

    handleCrudOperation(data: any, envelope: IEnvelope<any>) {
       const action = envelope.topic.split('.')[0];
       // console.log("in edit-restaurant handleCrud " + action);
        if (action === 'DELETE') {
            this.backUp = null;
            this.editForm.reset();
            return;
        }
        this.backUp = { ...data.selectedRestaurant };
        delete this.backUp.reviewDTOs;
        this.editForm.reset();
        this.editForm.setValue(this.backUp);
        this.actionState = action;



    }


    ngOnDestroy() {
        if (this.crudRequestSubscription) {
            this.crudRequestSubscription.unsubscribe();
            this.crudRequestSubscription = null;
        }
    }


    log() {
        // console.log(this.editForm.value);
        console.log(` errors ${JSON.stringify(this.editForm.controls.city.errors)} min  ${this.editForm.controls.city.errors.minlength}`)
    }

    formOkay() {
        return this.editForm.valid && !this.equalToBackup();
    }
    /**
     * return true if you are equal to the backup
     * false if not
     */
    equalToBackup() {
        if (!this.backUp) {
            return true;
        }
        const akeys = Object.keys(this.backUp);
        const bkeys = Object.keys(this.editForm.value);
        const len = akeys.length;
        if (len !== bkeys.length) { return false };
        for (let i = 0; i < len; i++) {
            if (this.backUp[akeys[i]] !== this.editForm.value[akeys[i]]) { return false };
        }
        return true;
    }

    saveAction(ev: any) {
        if (this.formOkay()) {
            const dataToSend = this.editForm.value;
            this.backUp = this.editForm.value;
            this.editForm.reset();
            this.editForm.setValue(this.backUp);
            if (this.actionState === 'ADD') {

                this.sub.getChannel().publish(ADD_RESTAURANT_COMMIT_TOPIC, dataToSend);
            } else {

                this.sub.getChannel().publish(SAVE_RESTAURANT_COMMIT_TOPIC, dataToSend);
            }

        }
    }

    cancelAction(ev: any) {
        this.editForm.reset();
        this.editForm.setValue(this.backUp);

    }

}
