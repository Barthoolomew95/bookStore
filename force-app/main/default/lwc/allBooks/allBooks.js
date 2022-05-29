import { LightningElement,track } from 'lwc';
import getBooks from '@salesforce/apex/BookController.getAllBooks'
import searchBooks from '@salesforce/apex/BookController.getBooksContainingWord'

export default class AllBooks extends LightningElement {
    @track books
    searchValue
    error
    async getAllBooks(){
        try{
            this.books=await getBooks();
        }catch(error){
            this.error=error;
        }
    }
    async searchBooks(){
        try{
            this.books=await searchBooks({searchValue: this.searchValue});
        }catch(error){
            this.error=error;
        }
    }
    connectedCallback(){
        this.getAllBooks();
    }
    onSearchInputValueChange(event){
        this.searchValue=event.target.value;
        if(this.searchValue==''){
            this.getAllBooks()
        }
        this.searchBooks()
    }
    sortBySold(){
       
    }
    sortByRecent(){

    }
    sortByAz(){
        
    }
}