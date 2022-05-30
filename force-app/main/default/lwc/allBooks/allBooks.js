import { LightningElement,track } from 'lwc';
import getBooks from '@salesforce/apex/BookController.getAllBooks'
import searchBooks from '@salesforce/apex/BookController.getBooksContainingWord'

export default class AllBooks extends LightningElement {
    @track books
    searchValue
    error
    @track booksAfterSearchAndFilter
    async getAllBooks(){
        try{
            this.books=await getBooks();
            this.booksAfterSearchAndFilter=[...this.books];
        }catch(error){
            this.error=error;
        }
    }
    async searchBooks(){
        this.booksAfterSearchAndFilter=[...this.books.filter(book=>{
            if(book.Name.toLowerCase().includes(this.searchValue.toLowerCase())||
            book.Author__c.toLowerCase().includes(this.searchValue.toLowerCase())||
            book.ISBN__c.toLowerCase().includes(this.searchValue.toLowerCase())){
                return true
            }else{

                return false;
            }
        })]
    }
    connectedCallback(){
        this.getAllBooks();
        
    }
    onSearchInputValueChange(event){
        console.log("onSearchInputValueChange")
        this.searchValue=event.target.value;
        if(this.searchValue==''){
            this.booksAfterSearchAndFilter=[...this.books];
        }else{

            this.searchBooks()
        }
    }
    sortBySold(){
       this.booksAfterSearchAndFilter.sort((a,b)=>b.Sold__c-a.Sold__c
       )
       
    }
    sortByRecent(){
        this.booksAfterSearchAndFilter.sort((a,b)=>new Date(b.CreatedDate)-new Date(a.CreatedDate))

    }
    sortByAZ(){
        this.booksAfterSearchAndFilter.sort((a,b)=>a.Name.localeCompare(b.Name));
    }
}