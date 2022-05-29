public without sharing class orderController {
    public orderController() {
    }
    
    @auraenabled() 
    public static Id newOrder( string userId){
            bs_customer__c customer =UserController.getCurrentUserCustomer(userId);
            integer amountOfOrders=getNumberOfOrdersForUser(userId);
            bs_order__c newOrder =new bs_order__c(
                customer__c=customer.Id,
                Name='order-'+(amountOfOrders+1)
            );
            
            insert newOrder;
            
            return newOrder.Id;
       
    }
    @auraenabled(cacheable = true) 
    public static Id getOrder( string customerId){
        
            bs_order__c newOrder =new bs_order__c(
                customer__c=customerId
            );
            
            insert newOrder;
            
            return newOrder.Id;
       
    }
    @AuraEnabled
    public static integer getNumberOfOrdersForUser(string userId){
        try {
            List<bs_order__c> allOrders=getOrdersForUser(userId);
            return allOrders.size();
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @auraenabled(cacheable=false) 
    public static void newOrderItems( list<string> booksIds, list<string> quantities,string orderId){
        try {
            List<bs_order_item__c> orderItemsToInsert=new List<bs_order_item__c>();
            for(integer i =0; i<booksIds.size(); i++){
                orderItemsToInsert.add(new bs_order_item__c(
                    book__c=booksIds[i],
                    Order__c=orderId,
                    Amount_of_book__c=integer.valueOf(quantities[i])
                    ));
                    
                }
                insert orderItemsToInsert;           
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
     }
    
    @auraenabled(cacheable=false) 
    public static List<bs_order_item__c> getItemsForOrder(string orderId){
        return [select Name, Book__c,amount_of_book__c from bs_order_item__c where order__C=:orderId];
    }
    // public static List<bs_order_item__c> getItemsForOrder(string orderId){
    //     return [select Name, Book__c,amount_of_book__c from bs_order_item__c where order__C=:orderId];
    // }
    @auraenabled(cacheable=true) 
    public static List<bs_order__C> getOrdersForUser(string userId){
        try {
            bs_customer__C customer=UserController.getCurrentUserCustomer(userId);
            system.debug(customer);
            return [
                select Amount_of_books_in_order__c,
                Customer__c,
                Name,
                Number_of_items_in_order__c,
                Status__c,
                createddate from bs_order__c where Customer__C=:customer.Id];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}