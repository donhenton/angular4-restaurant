export interface Restaurant
{
  name: string,
  zipCode: string,
  city: string,
  state: string,
  version: number 
  id: number,
  reviewDTOs: ReviewDTO[]
}


export interface ReviewDTO
{
    starRating: number,
    reviewListing: string,
    stampDate: Date,
    id: number


}

export interface WaitRequest
{

    state: boolean

}
export enum messageType
{
    info = 1, error
}

export interface RefreshMessage
{
    doRefresh:boolean 
    selectedRestaurantId:number  
    
}

export interface FeedbackMessage 
{
    show: boolean,
    message:string
    type:messageType

}

export interface ReviewPayload
{
    restaurantId:number,
    reviewDTO:ReviewDTO
}