public without sharing class UserController {
    
    public UserController() {
        
    }
    @AuraEnabled(cacheable = true)
    public static Contact getCurrentUserContact(string userId){
        User user=[select ContactId from User where id=:userId];
        return [select Name, MailingAddress, Customer__c from Contact where Id=:user.contactId ];
    }
    @auraenabled(cacheable=true) 
    public static bs_Customer__C getCurrentUserCustomer(string userId){
        User currentUser=[select ContactId from User where id=:userId];
        Contact userContact= [select Name, MailingAddress, Customer__c from Contact where Id=:currentUser.contactId ];
        return  [select Name, Last_Name__c, City__C,Country__C,street__C from bs_Customer__C where Id=:userContact.Customer__C ];
    }
    
    @AuraEnabled(cacheable = true)
    public static bs_Customer__c createCustomerForUser(string userId){
            Contact userContact =getCurrentUserContact(userId);
            bs_Customer__c newCustomer = new bs_Customer__c(
                Name=userContact.Name.split(' ')[0],
                Last_Name__c=userContact.Name.split(' ')[1],
                Country__c=userContact.MailingAddress.getCountry(),
                City__c=userContact.MailingAddress.getCity(),
                Street__c=userContact.MailingAddress.getStreet()
            );
            userContact.Customer__c=newCustomer.Id;
            insert newCustomer;
            update userContact;
            return newCustomer;
        
    }
}
