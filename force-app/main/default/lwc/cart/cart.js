import { LightningElement, wire,track } from 'lwc';
import newOrder from '@salesforce/apex/orderController.newOrder'
import newOrderItems from '@salesforce/apex/orderController.newOrderItems'
import getBooks from '@salesforce/apex/BookController.getBooksWithIds'
import getCurrentCustomer from '@salesforce/apex/UserController.getCurrentUserCustomer'
import sendConfirmationEmailtoUser from '@salesforce/apex/EmailController.sendEmail'
import uId from '@salesforce/user/Id';
import {getCartItemsForUser,clearUserCart,getCartQuantity} from 'c/localStorageManagement'
import cartMC from '@salesforce/messageChannel/cart__c'
import {
    publish,
    MessageContext
} from 'lightning/messageService';

export default class Cart extends LightningElement { 
    @track itemsInCart
    @track books
    orderId
    email
    @wire(MessageContext)
    messageContext;
    hanldeItemsInCart(event) { 
        this.itemsInCart = event.detail;
    }
    get isItemsInCart(){
        return this.itemsInCart.length > 0?true:false
    }

    
    async createOrder(){ 
         try{
            
            this.orderId= await newOrder({userId:uId});           
            ;
            let booksIds=[];
            let quantities=[];
            // window.confirm('Your order has been successfully placed!')
            this.itemsInCart.forEach((item)=>{
                booksIds.push(item.bookId)
                quantities.push(item.amountOfBook);
            })
            
            
            await newOrderItems({booksIds:booksIds, quantities:quantities,orderId:this.orderId})
            
            this.sendEmail();
            clearUserCart(); 
            this.itemsInCart=getCartItemsForUser();
            publish(this.messageContext, cartMC, {sum:0});
            window.alert('Your order has been successfully placed!')
        }catch(error){
             window.alert(error.body.message)
         }
    }
    async sendEmail(){
        let address = this.email;
        let subject='Your Order was placed'
        let body=`Congratulations! Your Order was successfully placed!\nYou ordered books:\n  `
        this.books.forEach(book=>{
            let item= this.itemsInCart.find(item=> item.bookId===book.Id)
            let booksa=`-${item.amountOfBook}x${book.Name}\n`;
            body+=booksa;
        })
        sendConfirmationEmailtoUser({email:address, subject:subject, body:body})

    }
    async getBooks(itemsInCart){
        try{
            let bookIdArray=[];
            itemsInCart.forEach(item => {
                bookIdArray.push(item.bookId)
            });
            this.books=await getBooks({bookIds:bookIdArray});
        }catch(error){
            console.log('errorBooks: ',error);
        }
    }
    async getCustomerEmail(){
        let customer=await getCurrentCustomer({userId:uId})
        this.email= customer.Email__c;
    }
    connectedCallback(){
        this.itemsInCart=getCartItemsForUser();
        this.getBooks(this.itemsInCart);
        this.email=this.getCustomerEmail();
        //  this.createOrder();
    }
    


}