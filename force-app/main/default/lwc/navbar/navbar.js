import { LightningElement,wire,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import awesomeBooksLogo from '@salesforce/resourceUrl/ABLogo'
import cartIcon from '@salesforce/resourceUrl/cartIcon'
import basePath from "@salesforce/community/basePath";

import navbarItemsLabels from './translations';
import { subscribe, MessageContext,unsubscribe} from 'lightning/messageService'
import cartMC from '@salesforce/messageChannel/cart__c'
import {getCartQuantity} from 'c/localStorageManagement'

export default class Navbar extends NavigationMixin(LightningElement) {
    navbarLabels=navbarItemsLabels;
    @track booksInCart=[];
   
    sum=getCartQuantity();
    @wire(MessageContext)messageContext
    subscription=null;

    get ABLogo() { return awesomeBooksLogo }
    get isGuest() { return isGuest; }
    get logoutLink() { return `/secur/logout.jsp?retUrl=${basePath}`; }
    get cartIcon(){ return cartIcon;}
   
    
    connectedCallback(){
        this.subscribeToMessageChannel();
        
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                cartMC,
                (message) => this.handleMessage(message)
            );
        }
       
    }
    handleMessage(message){
        console.log(message)
        if(message.sum!=null){

            this.sum=message.sum;
        }
    }
    unsubscribeFromMessageChannel(){
        unsubscribe(this.subscription)
        this.subscription=null;
    }
    disconnectedCallback(){   
        this.unsubscribeFromMessageChannel()
    }
    connectedCallback(){
        this.subscribeToMessageChannel();
    }
    toggleMenu(){
        
        this.template.querySelector('.navbar__items-container').classList.toggle('navbar__items-container--active')
    }
    navigateToHomePage() {
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }
    navigateToCartPage() {
       
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Cart__c'
            }
        });
    }
    navigateToAllBooksPage() {
       
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'allBooks__c'
            }
        });
    }
    navigateToUserProfilPage(){
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'User_Profile__c',
            }
        });
    }
    navigateToUserOrdersPage(){
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Orders__c',
            }
        });
    }
    navigateToLoginPage(){
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Login',
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
    handleLogout(){
        
        const newUrl=`/secur/logout.jsp?retUrl=${basePath}`
        window.open(newUrl,'_self')
        
    }
}