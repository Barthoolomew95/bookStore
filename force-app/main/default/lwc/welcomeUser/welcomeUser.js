import { LightningElement,track,wire,api } from 'lwc';
import uId from '@salesforce/user/Id';
import getUser from '@salesforce/apex/UserController.getCurrentUserContact';
export default class WelcomeUser extends LightningElement {
    userId=uId;
    @track user;
    error;
    async getUserInfo(userID) {
        try{
            this.user= await getUser({userId: userID});
        }catch(error){
            this.error=error;
        }

    }
    connectedCallback(){
        this.getUserInfo(this.userId);
    }
    
}