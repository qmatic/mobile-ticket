import { LocationStrategy } from "@angular/common";
import { Component, EventEmitter, HostListener, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AlertDialogService } from "../../shared/alert-dialog/alert-dialog.service";
import { TranslateService } from "ng2-translate";
import { Config } from "../../config/config";

declare var MobileTicketAPI: any;

@Component({
  selector: "app-otp-phone-number",
  templateUrl: "./otp-phone-number.component.html",
  styleUrls: ["./otp-phone-number.component.css"],
})
export class OtpPhoneNumberComponent implements OnInit {
  public phoneNumber: string;
  public phoneNumberError: boolean;
  public countryCode: string;
  public showLoader = false;
  private _showNetWorkError = false;

  @Output()
  showNetorkErrorEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private config: Config,
    private translate: TranslateService,
    private router: Router,
    private alertDialogService: AlertDialogService,
    private location: LocationStrategy
  ) {
    // preventing back button in browser
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  ngOnInit() {
    this.countryCode = this.config.getConfig("country_code");
    if (this.countryCode === "") {
      this.countryCode = "+";
    }

    this.phoneNumber = MobileTicketAPI.getEnteredOtpPhoneNum()
      ? MobileTicketAPI.getEnteredOtpPhoneNum()
      : MobileTicketAPI.getEnteredPhoneNum();

    MobileTicketAPI.setOtpPhoneNumber("");

    this.phoneNumberError = false;
  }

  phoneNumberFeildFocused() {
    if (this.phoneNumber === "" || this.phoneNumber === undefined) {
      this.phoneNumber = this.countryCode;
    }
  }

  phoneNumberFeildUnfocused() {
    if (this.phoneNumber === this.countryCode) {
      this.phoneNumber = "";
    }
  }

  onPhoneNumberEnter(event) {
    if (this.phoneNumberError && event.keyCode !== 13) {
      if (this.phoneNumber.trim() !== "") {
        this.phoneNumberError = false;
      }
    }
  }

  onPhoneNumberChanged() {
    this.phoneNumberError = false;
  }

  phoneNumContinue() {
    if (
      this.phoneNumber.match(/^\(?\+?\d?[-\s()0-9]{6,}$/) &&
      this.phoneNumber !== this.countryCode && this.phoneNumber.trim().length > 5
    ) {
      this.showLoader = true;
      this.phoneNumber = this.phoneNumber.trim();
      if( this.phoneNumber[0]=='+'){
        this.phoneNumber = this.phoneNumber.slice(1);
      }
      if( this.phoneNumber.slice(0,2)=='00'){
        this.phoneNumber = this.phoneNumber.slice(2);
      }

      MobileTicketAPI.setOtpPhoneNumber(this.phoneNumber);
      MobileTicketAPI.sendOTP(
        this.phoneNumber,
        (data) => {
          if (data == "OK") {
            this.showLoader = false;
            this.router.navigate(["otp_pin"]);
          } else if(data == "Already Reported") {
            this.translate.get('otp.pleaseWait').subscribe((res: string) => {
              this.alertDialogService.activate(res).then( data => {
                this.showLoader = false;
              });
            }); 
          } else {
            this.translate.get('connection.issue_with_connection').subscribe((res: string) => {
              this.alertDialogService.activate(res).then( data => {
                this.showLoader = false;
                MobileTicketAPI.setOtpPhoneNumber("");
                this.router.navigate(["branches"]);
              });
            });
          }
        },
        (err) => {
          this.translate.get('connection.issue_with_connection').subscribe((res: string) => {
            this.alertDialogService.activate(res).then( data => {
              this.showLoader = false;
              MobileTicketAPI.setOtpPhoneNumber("");
              this.router.navigate(["branches"]);
            });
          });
        }
      );
    } else {
      this.phoneNumberError = true;
    }
  }

  showHideNetworkError(value: boolean) {
    this._showNetWorkError = value;
    this.showNetorkErrorEvent.emit(this._showNetWorkError);
  }

  get showNetWorkError(): boolean {
    return this._showNetWorkError;
  }

  @HostListener('window:beforeunload',['$event'])
  showMessage($event) { 
    $event.returnValue='Your data will be lost!';
  }
}
