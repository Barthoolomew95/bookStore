import { LightningElement } from 'lwc';
import navbarItemsLabels from './translations';
import { NavigationMixin } from 'lightning/navigation';

export default class Footer extends NavigationMixin(LightningElement) {
    footerLabels=navbarItemsLabels;
    get currentYear(){
        return new Date().getFullYear()
    }
    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }
    navigateToAllBooksPage() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'allBooks__c'
            }
        });
    }
}