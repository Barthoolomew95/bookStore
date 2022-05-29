import { LightningElement,api,wire,track } from 'lwc';
import getRecentBooks from '@salesforce/apex/BookController.getAllBooks'
import headingX from './translations'

export default class BookList extends LightningElement {
    
    label=headingX;
    error ;
    @api books;
   

}