/**
 * see: https://angular-templates.io/tutorials/about/angular-forms-and-validations
 *    npm install --save-prod google-libphonenumber
 */

import { FormControl, FormGroup, AbstractControl, ValidatorFn  } from '@angular/forms';
// import * as libphonenumber from 'google-libphonenumber';

export class UsernameValidator {
  static validUsername(fc: FormControl){
    const isAvailable = ()=>{
      return true;  // placeholder
    };  
    if(isAvailable()){
      return ({validUsername: true});
    } else {
      return (null);
    }
  }
}


export class PasswordValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  /**
   * 
   * @param formGroup 
   * @param keys string[], formGroup.controls to check, e.g. ['password', 'confirm_password']
   */
  static areEqual(formGroup: FormGroup, keys:string[]=['password', 'confirm_password']) {
    let value;
    let valid = true;
    // keys = keys || Object.keys(formGroup.controls);
    for (let key of keys) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];

        if (value === undefined) {
          value = control.value
        } else {
          if (value !== control.value) {
            valid = false;
            // set error in all controls
            keys.forEach( key=>{
              const control = <FormControl>formGroup.controls[key];
              const errors = Object.assign({}, control.errors,  {
                areEqual: "invalid"
              });
              control.setErrors( errors ); 
            });
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: "invalid", // shows in formGroup.erros
    };
  }
}

export class PhoneValidator {
  // Inspired on: https://github.com/yuyang041060120/ng2-validation/blob/master/src/equal-to/validator.ts
  static validCountryPhone = (countryControl: AbstractControl): ValidatorFn => {
    let subscribe = false;
    return (phoneControl: AbstractControl): {[key: string]: boolean} => {

      if (!subscribe) {
        subscribe = true;
        countryControl.valueChanges.subscribe(() => {
          phoneControl.updateValueAndValidity();
        });
      }

      if (phoneControl.value !== '') {
        try {

          const phoneUtil = null;   // libphonenumber.PhoneNumberUtil.getInstance();
          const phoneNumber = '' + phoneControl.value + '';
          const region = countryControl.value;
          const pNumber = phoneUtil && phoneUtil.parseAndKeepRawInput(phoneNumber, region.iso);
          const isValidNumber = phoneUtil && phoneUtil.isValidNumber(pNumber);

          if (isValidNumber) {
            return undefined;
          }
        } catch (e) {
          console.log(e);
          return {
            validCountryPhone: true
          };
        }

        return {
          validCountryPhone: true
        };
      } else {
        return undefined;
      }
    };
  }
}

