import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';

export class InputValidators {
 static cannotBeEmpty(control: FormControl)
    {
        if (!control.value)
        {
            return {isEmpty: true,message: "Cannot be empty"}
        }
        if (control.value && control.value.trim().length == 0 )
        {
            return {isEmpty: true,message: "Cannot be empty"}
        }
        return null; //return null if you are valid

    }
}