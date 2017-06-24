import {Restaurant}  from './../model/restaurant.interface';
import { Component, Input, EventEmitter, Output,ElementRef ,Inject } from '@angular/core';


@Component({
  selector: 'restaurant-list-row',
  template: `
                     
                    <td  (click)="onClick($event,'edit')" class="nameItem"><span >{{row.name}}</span></td>
                    <td  (click)="onClick($event,'edit')" class="cityItem">{{row.city}}</td>
                    <td  (click)="onClick($event,'edit')" class="stateItem">{{row.state}}</td>
                    <td  (click)="onClick($event,'edit')" class="zipCodeItem">{{row.zipCode}}</td>
                    <td  (click)="onClick($event,'edit')" class="versionItem">{{row.version}}</td>
                    <td class="actionItems">
                    <button (click)="onClick($event,'edit')" class="editButton">Edit</button>
                    </td>
                    <td class="actionItems">
                    <button (click)="onClick($event,'delete')" class="warnButton">Delete</button>
                    </td>
                 
       
  `
})
export class RestaurantListRow { 



    @Input() row:Restaurant;
    @Output('edit-event') editChange = new EventEmitter();
    @Output('report-dom') reportDom = new EventEmitter(); //used to report its dom object
    private domNode: HTMLElement = null;

    constructor(@Inject(ElementRef) elementRef: ElementRef)
    {
       this.domNode = elementRef.nativeElement;

    }
    ngAfterViewInit()
    {
         //this.reportDom.emit({"dom": this.domNode});
        
    }

    public getDom()
    {
      return this.domNode;
    }


    onClick(ev,type)
    {
          this.editChange.emit({"type": type,"selectedRestaurant": this.row});
    }

}