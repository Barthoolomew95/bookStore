import { LightningElement,api,track } from 'lwc';
import getItemsForOrder from '@salesforce/apex/orderController.getItemsForOrder'

export default class Order extends LightningElement {
    @api order
    @track orderItems;
    @track date

    connectedCallback(){
        this.getDate();
        this.getOrderItems();
    }
    getDate(){
        const createdDateFromOrder=this.order.CreatedDate;
        const date= new Date(createdDateFromOrder);
        this.date= `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    }
    async getOrderItems(){
        this.orderItems= await getItemsForOrder({orderId:this.order.Id})
    }
    showOrderItems(event){
        this.template.querySelector('.order').classList.toggle('order--after-click')
        this.template.querySelector('.order__items').classList.toggle('order__items--visible')
    }

}