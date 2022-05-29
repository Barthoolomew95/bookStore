public without sharing class EmailController {
    public EmailController() {

    }
    @AuraEnabled
    public static void sendEmail(string email, string subject, string body ){
        OrgWideEmailAddress owea = [
            SELECT Id, Address, DisplayName FROM 
            OrgWideEmailAddress WHERE DisplayName='Awesome Books'];
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        if ( owea != null) {
            message.setOrgWideEmailAddressId(owea.Id);
        }
        message.toAddresses = new String[] {email};
        message.optOutPolicy = 'FILTER';
        message.subject = subject;
        message.plainTextBody = body;
        Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {message};
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);

        if (results[0].success) 
        {
            System.debug('The email was sent successfully.');
        }else{
            System.debug('The email failed to send: ' + results[0].errors[0].message);
        }
    }
}
