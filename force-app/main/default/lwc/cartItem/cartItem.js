import { LightningElement,api,track,wire } from 'lwc';
import getBook from '@salesforce/apex/BookController.getBook'
import {deleteItemFromUserCart,getCartQuantity,getCartItemsForUser,updateItemFromUserCart} from 'c/localStorageManagement'
import {
    publish,
    MessageContext
} from 'lightning/messageService';
import cartMC from '@salesforce/messageChannel/cart__c'
import currency from '@salesforce/i18n/currency'
import addIcon from '@salesforce/resourceUrl/addIcon'
import substractIcon from '@salesforce/resourceUrl/substractIcon'


export default class CartItem extends LightningElement {
    @api amount 
    @api recordid
    @track book
    price=0
    currentCurrency=currency
    @wire(MessageContext)
    messageContext;
    addIcon=addIcon;
    substractIcon=substractIcon



   
    connectedCallback(){
        try {                
            this.getBook();    
        }catch(e){
            console.error(e)
        }
    }
    // get amount() {return item.amountOfBook}
    async getBook(){
        try {
            this.book= await getBook({bookId:this.recordid}) 
            this.price=parseInt(this.amount)*this.book.Price__c;
        }catch(e){
            console.error('getBook() ', error);
        }
    }
    cancelItem(){
        deleteItemFromUserCart(this.recordid)
        publish(this.messageContext, cartMC, {sum:getCartQuantity()});

        let cartItems=getCartItemsForUser()
        const sendCartItems = new CustomEvent("itemsincart", {
            detail: cartItems
          });
      
          // Dispatches the event.
        this.dispatchEvent(sendCartItems);
        this.book=null;
    }
    handleAmountChange(event){
        if(event.target.dataset.id==='+'){
            this.amount+=1;
        } 
        else if(event.target.dataset.id==='-'){
            if(this.amount>1){
                this.amount-=1;
            }
        }
        updateItemFromUserCart(this.recordid,this.amount)
        let cartItems=getCartItemsForUser()
        const sendCartItems = new CustomEvent("itemsincart", {
            detail: cartItems
          });
        this.price=this.amount*this.book.Price__c;
        this.dispatchEvent(sendCartItems);
        publish(this.messageContext, cartMC, {sum:getCartQuantity()});
    }
}