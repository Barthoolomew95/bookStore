import { LightningElement,api,wire,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import newOrder from '@salesforce/apex/orderController.newOrder'
import newOrderItem from '@salesforce/apex/orderController.newOrderItem'
import createCustomer from '@salesforce/apex/UserController.createCustomerForUser'
import getCurrentUserCustomer from '@salesforce/apex/UserController.getCurrentUserCustomer'
import uId from '@salesforce/user/Id';
import awesomeBooksLogo from '@salesforce/resourceUrl/ABLogo'
import cartIcon from '@salesforce/resourceUrl/cartIcon'
import basePath from "@salesforce/community/basePath";
// import {navbarLoginItem,navbarLogoutItem,navbarOrderItem,navbarAllbooksItem,navbarProfileItem,navbarHomeItem,navbarSignUpItem} from './translations';
import navbarItemsLabels from './translations';
import { subscribe, MessageContext,unsubscribe} from 'lightning/messageService'
import cart from '@salesforce/messageChannel/cart__c'


export default class Navbar extends NavigationMixin(LightningElement) {
    navbarLabels=navbarItemsLabels;
    @track booksInCart=[];
    sum=0;

    @wire(MessageContext)messageContext
    subscription=null;

    get ABLogo() { return awesomeBooksLogo }
    get isGuest() { return isGuest; }
    get logoutLink() { return `/secur/logout.jsp?retUrl=${basePath}`; }
    get cartIcon(){ return cartIcon;}
   
    
    
    handleMessage(message){
        const index =this.booksInCart.findIndex(book => book.bookId === message.bookId);
        console.log(index);
        if (index >= 0) {
            this.booksInCart[index].amountOfBook+=message.amountOfBook;
        }else{
            this.booksInCart.push({
               bookId:message.bookId,
               amountOfBook:message.amountOfBook
            })
        }
        this.sum+=parseInt(message.amountOfBook);
        window.console.log('ilośc= '+this.booksInCart.length);
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                cart,
                (message) => this.handleMessage(message)
            );
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
        // this.sum=this.amountOfBooksInCart()
    }
    orderId='';
    async createOrder(){ 
        console.log('XDDD')
         let customer = await getCurrentUserCustomer({userId:uId});
        console.log('XDDD',customer.Id)
        this.orderId= await newOrder({customerId:customer.Id});
        console.log('orderId:',this.orderId);
        for(const book of this.booksInCart){
           await newOrderItem({
                orderId:this.orderId,
                bookId:book.bookId,
                amount:book.amountOfbook})
        }
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
        this.createOrder();
        window.localStorage.setItem('cart', JSON.stringify(this.booksInCart));
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
        const newPagePath = basePath.replace('/s', "");
        const newUrl=`/secur/logout.jsp?retUrl=${basePath}`
        window.open(newUrl,'_self')
        
    }
}