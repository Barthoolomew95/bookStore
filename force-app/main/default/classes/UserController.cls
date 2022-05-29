public without sharing class UserController {
    
    public UserController() {
        
    }
    @AuraEnabled(cacheable = true)
    public static Contact getCurrentUserContact(string userId){
        User user=[select ContactId from User where id=:userId];
        return [select Name, MailingAddress, Customer__c,Email from Contact where Id=:user.contactId ];
    }
    @auraenabled(cacheable=true) 
    public static bs_Customer__C getCurrentUserCustomer(string userId){       
        Contact userContact= getCurrentUserContact(userId);
        return  [select Name, Last_Name__c, City__C,Country__C,street__C, Phone__c,Email__c from bs_Customer__C where Id=:userContact.Customer__C ];
    }
    @auraenabled() 
    public static void updateCurrentUserCustomer(bs_Customer__C customerToUpdate){       
       update customerToUpdate;
    }
    
   
}