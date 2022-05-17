import { LightningElement, wire,track } from 'lwc';
import getOrdersForUser from '@salesforce/apex/orderController.getOrdersForUser'
import uId from '@salesforce/user/Id'
export default class Cart extends LightningElement { 
    @track books
    get firstBook(){
        console.log('books:',this.books.length)
        return this.books[0].bookId;
    }
    // async getOrders(){
    //     this.books=await getOrdersForUser(uId)
    // }
    connectedCallback(){
        this.books=JSON.parse(window.localStorage.getItem('cart'));
        console.log('aaaa',JSON.parse(window.localStorage.getItem('cart')))
        console.log('length',localStorage.length)
    }
    


}