trigger CancelOrder on bs_order__c (before update) {
    Set<bs_order__c>ordersToCancel=new Set<bs_order__c>();
    for(Id orderId :Trigger.newMap.keySet()){
        if(trigger.oldMap.get(orderID).Status__c!='Canceled'&& trigger.newMap.get(orderId).status__c=='Canceled'){
            ordersToCancel.add(Trigger.newMap.get(orderId));
        }
    }
	List<book__c> booksToUpdate=new List<book__c>();
    for(bs_order__c order :ordersToCancel){
        list<bs_order_item__c> orderItems =[select Book__C,Amount_of_book__c from bs_order_item__c where Order__C=:order.Id ];
        for(bs_order_item__c orderItem: orderItems){
            book__c book =[select In_stock__c,sold__c from Book__c where Id=:orderItem.Book__c];
            book.In_Stock__c+=orderItem.Amount_of_book__c;
            book.sold__c-=orderItem.Amount_of_book__c;
            booksToUpdate.add(book);
        }
    }
    update booksToUpdate;
    
}