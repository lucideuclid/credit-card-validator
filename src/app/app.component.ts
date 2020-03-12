import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Credit Card Validator';
  ccForm: FormGroup;
  post: any;
  cardnumber: number;
  cardholdername: string;
  expirydate: string;
  cvv: number;
  creditcardtype: String;
  ccnumlength: number;
  private initccvalue = '';
  private visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  private mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  private amexpRegEx = /^(?:3[47][0-9]{13})$/;
  constructor(private ccform: FormBuilder) {
    this.ccForm = ccform.group({
      'card-holder-name': [null, Validators.required],
      'expiry-date': [null, Validators.required],
      'cvv': [null, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern("^(0{0,2}[1-9]|0?[1-9][0-9]|[1-9][0-9][0-9])$")])],
      'card-number': [null,Validators.compose([Validators.required,Validators.pattern("^[453][0-9]*$")])]
    });
  }
  ngOnInit(){
    this.ccForm.get('card-number').valueChanges.subscribe(
      (num) =>{
        if(num.startsWith("4")){
          this.creditcardtype = "Visa Card";
          this.ccForm.get('card-number').setValidators([Validators.required,Validators.pattern(this.visaRegEx)]);
          this.ccnumlength = num.length;
        } else if(num.startsWith("5")){
          var value = num;
          this.ccForm.get('card-number').setValidators([Validators.required,Validators.pattern(this.mastercardRegEx)]);
          this.creditcardtype = "Master Card";
          this.ccnumlength = num.length;
        } else if(num.startsWith("34") || num.startsWith("37")){
          this.creditcardtype = "American Express";
          this.ccForm.get('card-number').setValidators([Validators.required,Validators.pattern(this.amexpRegEx)]);
          this.ccnumlength = num.length();
        } else if(num.length >= 13) {
          this.creditcardtype = "✕";
          this.ccnumlength = num.length;
        } else if(num.length == 0) {
          this.creditcardtype = "";
          this.ccnumlength = num.length;
        } else {
          this.creditcardtype = "?";
        }
        if(this.initccvalue != num.charAt(0)){
          this.initccvalue = num.charAt(0);
          this.ccForm.get('card-number').updateValueAndValidity();
        }
      }
    )
  }

  submitForm(post){
    this.cardholdername = post['card-holder-name'];
    this.cardnumber = post['card-number'];
    this.expirydate = post['expiry-date'];
    this.cvv = post['cvv'];
  }
}
