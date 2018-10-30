import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/oauth/authentication.service';
import { Router } from '@angular/router';
import { PublicServicesService } from '../services/public-services.service'

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [PublicServicesService]
})
export class Login implements AfterViewInit {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public error = '';
  model: any = {};


  public serverList: any;

  constructor(fb: FormBuilder, private router: Router,
    private authenticationService: AuthenticationService,
    private publicServicesService: PublicServicesService) {


    publicServicesService.getServers().subscribe(data => {
      this.serverList = data;
      
    })

  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

  }

  ngAfterViewInit(){
    
  }


  public login(): void {
    this.submitted = true;
    // your code goes here
    // console.log(values);

    

    this.authenticationService.login(this.model.username, this.model.password,this.model.server)
    
      .subscribe(result => {
        if (result === true) {
          // login successful
          console.log('success on login');
          this.router.navigate(['/pages/reportes']);
        } else {
          // login failed
          this.error = 'Usuario o contraseña son incorrectos.';

        }
      });
  }
}
