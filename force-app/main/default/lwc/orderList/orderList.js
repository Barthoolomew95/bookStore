import { LightningElement, track } from 'lwc';
import getAllOrders from '@salesforce/apex/orderController.getOrdersForUser'
import uId from '@salesforce/user/Id';

export default class OrderList extends LightningElement {
    @track orders
    

    async getOrders(){
        this.orders=await getAllOrders({userId:uId})
    }
    connectedCallback(){
        this.getOrders();
    }
}