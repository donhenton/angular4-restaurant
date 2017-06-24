import {FeedbackMessage} from './restaurant.interface';
import {messageType} from './restaurant.interface';

export default class  FeedbackMessageImpl implements FeedbackMessage {
   show:boolean;
   message:string;
   type:messageType = messageType.info;





}