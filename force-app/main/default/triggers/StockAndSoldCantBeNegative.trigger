trigger StockAndSoldCantBeNegative on Book__c (before insert,before Update) {
    for(Book__c book: Trigger.new){
        if(book.In_stock__c<0){
           book.In_Stock__c.addError('You can\'t do that, "In Stock" must be positive');
        }
        if(book.Sold__c<0){
           book.Sold__c.addError('You can\'t do that, "Sold" must be positive');
        }
    }
}