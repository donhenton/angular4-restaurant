import { Restaurant, ReviewDTO } from './../model/restaurant.interface';
import { Component, Input, EventEmitter, Output, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/Rx';
import { InputValidators } from './../validators/input-validators';

@Component({
    selector: 'review-list-row',
    template: `
                    <form [formGroup]="reviewForm">
                    
                    <td class="rating">
                            <input type="hidden" formControlName="stampDate">
                            <span  *ngIf="!matchCurrent()">{{review.starRating}}</span>
                    
                            <select  *ngIf="matchCurrent()"  id="starRating" formControlName="starRating">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    
                            </select> 
                     <i class="fa fa-star-o" aria-hidden="true"></i>
                    </td>
                    <td class="listing">
                        <span *ngIf="!matchCurrent()">{{review.reviewListing}}</span>
                         <input  *ngIf="matchCurrent()" formControlName="reviewListing"   name="reviewListing" id="reviewListing" type="text" /> 
                    </td>
                    <td class="actionButton">
                         
                            <button *ngIf="!matchCurrent()"  (click)="onClick($event,'EDIT')" class='btnEdit'>Edit</button>    
                            <button *ngIf="matchCurrent()"  [ngClass]="{inactive:this.reviewForm.invalid}"     (click)="onClick($event,'SAVE')" class='btnEdit'>Save</button> 
                       
                    </td> 
                    
                    <td class="actionButton">
                       
                            <button *ngIf="!matchCurrent()" (click)="onClick($event,'DELETE')" class='btnDelete'>Delete</button>                       
                            <button *ngIf="matchCurrent()" (click)="onClick($event,'CANCEL')" class='btnDelete'>Cancel</button>
                        
                    </td> 
                    </form>
  `
})
export class ReviewListRow {



    @Input() review: ReviewDTO;
    @Input() idx: number;
    @Input() currentReview: ReviewDTO; //selected by the container if none, then this is null;

    @Output('edit-event') editChange = new EventEmitter();
    private domNode: HTMLElement = null;
    private reviewForm: FormGroup;
    private reviewBackup:ReviewDTO = null;
    private sentInvalid:boolean = false;
    constructor( @Inject(ElementRef) elementRef: ElementRef, fb: FormBuilder) {
        this.domNode = elementRef.nativeElement;
        this.reviewForm = fb.group({
            reviewListing: ['', Validators.compose([
                Validators.required,
                InputValidators.cannotBeEmpty

            ])],
            stampDate: [new Date()],
            id: [-1],
            starRating: [1, Validators.required]
        })







    }
    ngAfterViewInit() {
        //this.reportDom.emit({"dom": this.domNode});

    }

    ngOnInit() {
        this.reviewForm.setValue(this.review);
        this.reviewBackup = {...this.review};
        this.reviewForm.controls.reviewListing.valueChanges
            .debounceTime(200)
            .subscribe(this.onListingChange.bind(this));
    }

    onListingChange(ev) {
        if (this.reviewForm.invalid && !this.sentInvalid)
        {
            //formObject.controls.username.errors
            let message = "Review Listing "+this.reviewForm.controls['reviewListing'].errors.message;
            this.editChange.emit({ "type": "FORM_VALIDATION", "selectedReview": this.review, idx: this.idx, invalid: this.reviewForm.invalid, message: message });
            this.sentInvalid = true;
        }
        if (!this.reviewForm.invalid && this.sentInvalid)
        {
            this.sentInvalid = false;
            this.editChange.emit({ "type": "FORM_VALIDATION", "selectedReview": this.review, idx: this.idx, invalid: this.reviewForm.invalid, message:"" });
        }
         
    }

    matchCurrent(): boolean {
        let hit: boolean = false;
        if (this.currentReview && this.currentReview.id === this.review.id) {
            hit = true;
        }

        return hit;
    }

    public getDom() {
        return this.domNode;
    }


    onClick(ev, type) {

        if (type === "CANCEL") {
            this.reviewForm.setValue(this.reviewBackup);
            this.editChange.emit({ "type": type, "selectedReview": this.review, idx: this.idx });
        }
        if (type === "DELETE") {

            this.editChange.emit({ "type": type, "selectedReview": this.review, idx: this.idx });
        }
        if (type == "EDIT") {


            this.editChange.emit({ "type": type, "selectedReview": this.review, idx: this.idx });
        }
        if (type == "SAVE") {

            if (this.reviewForm.valid) {
                if (this.review.id > -1) {
                    this.editChange.emit({ "type": type, "selectedReview": this.reviewForm.value, idx: this.idx });
                }
                else {
                    this.editChange.emit({ "type": "ADD", "selectedReview": this.reviewForm.value, idx: this.idx });
                }
            }
        }

    }


}