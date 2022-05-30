trigger SetOrderItemName on bs_Order_Item__c (before insert,before update) {
    set<bs_order__c> ordersToUpdate=new set<bs_order__c>();
    for(bs_order_item__c orderItem :trigger.new){
        book__c book= [select Name from Book__c where Id=:OrderItem.Book__c];
        orderitem.Name=orderItem.Amount_of_book__c+'-'+ book.Name;
    }
    
}