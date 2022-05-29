import { LightningElement,api,track,wire } from 'lwc';
import {
    publish,
    MessageContext
} from 'lightning/messageService';
import getBook from '@salesforce/apex/BookController.getBook';
import currency from '@salesforce/i18n/currency'
import isGuest from '@salesforce/user/isGuest';
import cartMC from '@salesforce/messageChannel/cart__c'
import {updateUserCartInLocalStorage,getUserCartFromLocalStorage} from 'c/localStorageManagement'



export default class BookDetail extends LightningElement {
    isGuest=isGuest
    @api recordId
    @track book
    currentCurrency=currency;
    amountLabelValue;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.getBookData();
        this.amountLabelValue=1;
    }
    get amountValue(){
        return this.amountLabelValue;
    }
    async getBookData(){
        
        this.book= await getBook({bookId: this.recordId});
    }
    handleAmountChange(event){
        if(event.target.dataset.id==='+'){
            this.amountLabelValue+=1;
        } 
        else if(event.target.dataset.id==='-'){
            if(this.amountLabelValue>1){
                this.amountLabelValue-=1;
            }
        }
    }
 
    handleAddtoCart(){
        try{
            const newCartItem = {
                bookId: this.recordId,
                amountOfBook: this.amountLabelValue,
            };
            let userCart=getUserCartFromLocalStorage();
            let index;
            if(userCart.cartItems.length>0){
                index =userCart.cartItems.findIndex(book => book.bookId === newCartItem.bookId);
                
                if (index >= 0) {
                    userCart.cartItems[index].amountOfBook+=newCartItem.amountOfBook;
                }else{
                    userCart.cartItems.push(newCartItem)

                }
            }else{
                userCart.cartItems.push(newCartItem)
            }
            userCart.cartQuantity+=parseInt(newCartItem.amountOfBook);    

            updateUserCartInLocalStorage(userCart);
            publish(this.messageContext, cartMC, {sum:userCart.cartQuantity});

        }catch(e){
            console.error(e);
        }
    }

}