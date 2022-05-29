import { LightningElement,track,wire,api } from 'lwc';
import uId from '@salesforce/user/Id';
import getCustomer from '@salesforce/apex/UserController.getCurrentUserCustomer';
export default class WelcomeUser extends LightningElement {
    
    @track user;
    error;
    async getCustomerInfo() {
        try{
            this.user= await getCustomer({userId: uId});
        }catch(error){
            this.error=error;
        }

    }
    connectedCallback(){
        this.getCustomerInfo();
    }
    
}