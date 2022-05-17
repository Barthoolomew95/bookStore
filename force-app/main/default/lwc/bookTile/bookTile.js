import { LightningElement,api,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// import bookSchema from '@salesforce/schema/book__c';
import basePath from "@salesforce/community/basePath";

export default class BookTile extends NavigationMixin(LightningElement) {
    @api book;
    
    navigateToBookDetailPage(){
      // this[NavigationMixin.Navigate]((`/book/${this.book.Id}`), false);
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.book.Id,
            objectApiName: 'Book__c',
            actionName: 'view'
        }
    });
        console.log(`${basePath}/book/${this.book.Id}`)
    }
    get bookDetailPageUrl(){
        return `${basePath}/book/${this.book.Id}`
    }
}