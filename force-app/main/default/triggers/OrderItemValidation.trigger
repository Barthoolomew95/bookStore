trigger OrderItemValidation on bs_Order_Item__c (before insert) {
	List<bs_order_item__c> orderItems=new List<bs_order_item__c>();
    List<Book__c> relatedBooks= new List<Book__c>();
    for (bs_order_item__c orderItem : Trigger.new){
        orderItems.add(orderItem);
    }
    
    for(bs_order_item__c orderItem : orderItems){
        book__c book= [Select In_Stock__c,Name from Book__c where Id=:orderItem.Book__c];
        bs_order__c order =[Select Status__C From  bs_order__c where id=:orderItem.Order__c];
        if(book.In_Stock__c<orderItem.Amount_of_book__c){
            orderItem.Amount_of_book__c.addError('You can\'t order '+orderItem.Amount_of_book__c +' book(s) "'+book.Name+' because available amount of this book in stock is '+book.In_Stock__c);
        }
        if(order.status__c=='Canceled'){
            orderItem.addError('You can\'t add item to canceled order');
        }
        
    }
}