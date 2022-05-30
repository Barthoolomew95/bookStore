trigger ISBNValidationRules on Book__c (before insert) {
	List<Book__c> books = new List<Book__c>();
    for(Book__c book : Trigger.new){
        string isbn=book.ISBN__c;
        if(isbn.length()!=10&&book.ISBN__c.length()!=13){
                    book.ISBN__c.addError('Valid ISBN number must have 10 or 13 digits.');
        }else {
            integer validation=0;
            string[] chars =isbn.split('');
            if(isbn.length()==10){  //validation for 10 digit ISBN              
                for(integer i=0;i<10;i++){
                  validation+=integer.valueOf(chars[i])*(10-i);         
                }
                if(math.mod(validation, 11)!=0){
                    book.ISBN__c.addError('This ISBN number is not valid.');
                }
            }else if(isbn.Length()==13){ // validation for 13 digit ISBN 
                for(integer i=0;i<13;i++){
                    integer digit=integer.valueOf(chars[i]);
                    integer multiplyer= math.mod(i, 2)==0?1:3;    
                    validation+=digit*multiplyer;       
                }
                if(math.mod(validation, 10)!=0){
                    book.ISBN__c.addError('This ISBN number is not valid.');
                }
            }       
        }
    }
}