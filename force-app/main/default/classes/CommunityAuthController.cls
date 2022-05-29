public without sharing class CommunityAuthController {
    public CommunityAuthController() {
        
    }
    @Auraenabled(cacheable=true)
    public static string doLogin(String username, String password,string startUrl){
        try {
            return Site.login(username, password, startUrl).getUrl();
        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            throw new AuraHandledException(e.getMessage());         
        }
    }


    @AuraEnabled
    public static boolean isEmailExist(String username){
        try {
            
            List<User> userList = new List<User>();
            userList = [Select Id, Name,Email From User Where Username = :username];

            

            return !userList.isEmpty();


        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

            
        }
    }
    @AuraEnabled()
    public static bs_Customer__c createCustomerForUser(string userId){
            Contact userContact =UserController.getCurrentUserContact(userId);
            if(userContact.Customer__c==null){
                bs_Customer__c newCustomer = new bs_Customer__c(
                    Name=userContact.Name.split(' ')[0],
                    Last_Name__c=userContact.Name.split(' ')[1],
                    Country__c='',
                    City__c='',
                    Street__c='',
                    Phone__c='',
                    Email__c=userContact.Email
                );
                insert newCustomer;
                userContact.Customer__c=newCustomer.Id;
                update userContact;
                return newCustomer;
            }else {
                return[select iD,Name,Last_Name__c,Country__c,City__C,Street__c from bs_Customer__c where id=:userContact.Customer__c];
            }
           
        
    }
    // static boolean passwordValidation(String password){
    //     if(password != null && password.length() > 7){
            
    //     }
    // }
    @AuraEnabled
    public static string registerUser(String firstName, String lastName, String email , String password, String startUrl){
        try {
            
            User u = new User();
            u.firstName = firstName;
            u.lastName = lastName;
            u.Username = email;
            u.Email = email;
            u.CommunityNickname = u.Username;

            
            system.debug('u.CommunityNickname:'+u.CommunityNickname);

               Id userId = Site.createExternalUser(u, null, password);
               system.debug('userId:'+userId);
            // }else {
            //     throw new AuraHandledException('User with this email already exists');
            // }
            
            if (userId != null) {
                
                createCustomerForUser(userId);
                String emailResult = sendWelcomeMail(u, userId);

                
                
            }
            
            return doLogin(email,password,startUrl);
            // throw new CalloutException();

        


        } catch (Exception e) {
            AuraHandledException excep= new AuraHandledException(e.getMessage());
            excep.setMessage(e.getMessage());
            throw excep;
            
            // if(!Test.isRunningTest()) throw new AuraHandledException(e.getMessage());

            
        }
    }


    @AuraEnabled
    public static string sendWelcomeMail(User usr, String userId){
        try {

            EmailController.sendEmail(usr.Email, 'Welcome', 'Welcome '+usr.Name+ 'in Awesome Books!');

            return 'success';

        } catch (Exception e) {            
            throw new AuraHandledException(e.getMessage());
        }
    }
}
