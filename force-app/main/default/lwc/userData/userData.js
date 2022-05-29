import { LightningElement,track } from 'lwc';
import uId from '@salesforce/user/Id';
import getCurrentUserCustomer from '@salesforce/apex/UserController.getCurrentUserCustomer'
import updateCurrentUserCustomer from '@salesforce/apex/UserController.updateCurrentUserCustomer'

export default class UserData extends LightningElement {
    @track userData
    @track newUserData
    editable=false;

    async getUserData(){
        try {
            this.userData= await getCurrentUserCustomer({userId:uId});
            this.newUserData= Object.assign({},this.userData);
        }catch(e){
            console.error(e)
        }
    }
    async updateUserData(){
        try {
            await updateCurrentUserCustomer({customerToUpdate:this.newUserData});
        }catch(e){
            console.error(e)
        }
    }
    connectedCallback(){
        this.getUserData();
    }
    toggleEditMode(event){
        if(this.editable&&event.target.dataset.id!='Cancel'){
            this.updateUserData();
            this.userData=this.newUserData;
        }
        this.editable=!this.editable;
    }

    editData(event){
        try {
            this.newUserData[event.target.dataset.id]=event.target.value; 
        } catch (error) {
            console.error(error)
        }
    }
}