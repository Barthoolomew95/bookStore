trigger StockValidation on bs_Order_Item__c (after insert,after update) {
	List<bs_order_item__c> orderItems=new List<bs_order_item__c>();   
    if(trigger.isInsert){
        for(bs_order_item__c orderItem : trigger.new){
            orderItems.add(orderItem);
        }
    }
    
    List<Book__c> booksToUpdate= new List<Book__c>();
    for(bs_order_item__c orderItem : orderItems){
        book__c book= [Select Id,In_Stock__c,Sold__c,Name from Book__c where Id=:orderItem.Book__c];
        bs_order__c order =[select Status__c from bs_order__c where Id =:orderItem.Order__C];
        if(order.Status__c=='New'){
           book.In_Stock__c-=orderItem.Amount_of_book__c;
           book.Sold__c+=orderItem.Amount_of_book__c;
        }
        booksToUpdate.add(book);   
    }
    update booksToUpdate;
}