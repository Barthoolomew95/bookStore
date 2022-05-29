import { LightningElement,track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import doLogin from '@salesforce/apex/CommunityAuthController.doLogin'

export default class CustomLogin extends NavigationMixin(LightningElement) {
    @track pageRef
    username 
    password
    error;

    connectedCallback(){
    }
    login(e){
        e.preventDefault();
        try {
            doLogin({username:this.username,password:this.password,startUrl:window.location.href}).then(result => {
               
                window.open(result,'_self')
            }).catch(error => {
                this.error=error.body.message;
                });
            // const newUrl=`/secur/logout.jsp?retUrl=${basePath}`
        } catch (error) {
            console.error(error)
        }
    }
    handleUserNameChange(event){
        
        this.username = event.target.value;
        
    }
    
    handlePasswordChange(event){
        
        this.password = event.target.value;
        
    }
    navigateToForgotPasswordPage(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'ForgotPassword',
            }
        });
    }
    navigateToRegisterPage(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Register',
            }
        });
    }
}