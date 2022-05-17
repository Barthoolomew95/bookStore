import { LightningElement,api } from 'lwc';
import getRecentBooks from '@salesforce/apex/BookController.getRecentBooks'
import { NavigationMixin } from 'lightning/navigation';

export default class BookCarousel extends NavigationMixin(LightningElement) {
    @api numberOfBooksToDisplay;
    // label=headingX;
    error ;
    books;
    async getBooks(numberOfBooks){
        try{
            this.books=await getRecentBooks({numberOfBooks: numberOfBooks});
        }catch(error){
            this.error=error;
        }
    }
    //  navigateToBookDetailPageUrl(event){
    //     console.log(event.target.dataset.id)
    //     // console.log(`${basePath}/book/${event.target.dataset.id}`)
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__ObjectPage',
    //         attributes: {
    //           recordId: event.target.dataset.id,
    //         //   objectApiName: 'Book_Detail__c',
    //           actionName: 'view'
    //         }
    //       });   
    //     // return `${basePath}/book/${event.target.dataset.Id}`
    // }
    connectedCallback(){
        this.getBooks(this.numberOfBooksToDisplay);
    }
}