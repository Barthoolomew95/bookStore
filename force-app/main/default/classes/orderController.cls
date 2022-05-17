public without sharing class orderController {
    public orderController() {
    }
    
    @auraenabled(cacheable=true) 
    public static Id newOrder( string customerId){
        
            bs_order__c newOrder =new bs_order__c(
                customer__c=customerId
            );
            if(newOrder!=null){
                insert newOrder;
            }
            return newOrder.Id;
       
    }

    @auraenabled(cacheable=false) 
    public static void newOrderItem( string orderId, string bookId, decimal amount ){
        try {
            bs_order_item__c newOrderItem =new bs_order_item__c(
                book__c=bookId,
                Order__c=orderId,
                Amount_of_book__c=amount
            );
            insert newOrderItem;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @auraenabled(cacheable=true) 
    public static bs_order__C[] getOrdersForUser(string userId){
        try {
            bs_customer__C customer=UserController.getCurrentUserCustomer(userId);
            return [
                select Amount_of_books_in_order__c,
                Customer__c,
                Name,
                Number_of_items_in_order__c,
                Status__c from bs_order__c where Id=:customer.Id];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
