import { LightningElement,api,track,wire } from 'lwc';
import {
    publish,
    MessageContext
} from 'lightning/messageService';
import getBook from '@salesforce/apex/BookController.getBook';
import currency from '@salesforce/i18n/currency'
import cart from '@salesforce/messageChannel/cart__c'


export default class BookDetail extends LightningElement {
    
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
        console.log(this.recordId)
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
        const payload = {
            bookId: this.recordId,
            amountOfBook: this.amountLabelValue,
        };
        console.log(payload.bookId+' '+ payload.amountOfBook);
        publish(this.messageContext, cart, payload);
    }

}