import { LightningElement,api,wire } from 'lwc';
import getRecentBooks from '@salesforce/apex/BookController.getRecentBooks'
import headingX from './translations'

export default class BookList extends LightningElement {
    @api numberOfBooksToDisplay;
    label=headingX;
    error ;
    books;
    async getBooks(numberOfBooks){
        try{
            this.books=await getRecentBooks({numberOfBooks: numberOfBooks});
        }catch(error){
            this.error=error;
        }
    }
    connectedCallback(){
        this.getBooks(this.numberOfBooksToDisplay);
    }

}