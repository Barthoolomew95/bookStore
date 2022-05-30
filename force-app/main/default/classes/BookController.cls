public without sharing class BookController {
    public bookController() {

    }
    // @auraenabled(cacheable=true)   
    // public static string getBookRecord(string bookId,string field){       
    //     return Database.query('Select '+field+ ' From Book__c Where Id =\''+bookId+'\'')[0].get(field).toString();
    //     // return [select Image_URL__c from Book__c Where id =:bookId][0].Image_URL__c;
    // }

    @auraenabled(cacheable=true)   
    public static Book__c getBook(string bookId){      
        return [select Name, ISBN__c, Author__C,In_Stock__c,Description__c,image_url__c,Price__c from Book__C where Id =:bookId];
        
    }
    @auraenabled(cacheable=true)   
    public static List<Book__c> getAllBooks(){      
        return [select Name, ISBN__c, Author__C,In_Stock__c,Description__c,image_url__c,Price__c,Sold__c,createddate from Book__C];
        
    }

    @auraenabled(cacheable=true)   
    public static List<Book__c> getRecentBooks(integer numberOfBooks){       
        return [select Name, ISBN__c, Author__c, In_Stock__c,Description__C, image_url__c,Price__C from Book__C order by createddate desc limit :numberOfBooks ];
        
    }
    @auraenabled(cacheable=true)   
    public static List<Book__c> getBestsellers(integer numberOfBooks){       
        return [select Name, ISBN__c, Author__c, In_Stock__c,Sold__c,Description__C, image_url__c,Price__C from Book__C order by Sold__c desc limit :numberOfBooks ];
        
    }
    @auraenabled(cacheable=true)   
    public static List<Book__C> getBooksWithIds(List<string> bookIds){  
        // list<book__C> books=new list<book__C>();
        // for(string id :bookIds){
        //     books.add([select Id,Name, ISBN__c, Author__c, In_Stock__c from Book__C where id=:id]);
        // }     
        // return books;
        return [select Id,Name, ISBN__c, Author__c, In_Stock__c,Price__C from Book__C where id=:bookIds];
        
    }
    @auraenabled()   
    public static List<Book__C> getBooksContainingWord(string searchValue){  
        string searchV='%'+searchValue+'%';
        return  [select id,Name,Author__c,Price__c,image_url__c from Book__C where (Name like :searchV) or (Author__c Like:searchV)];
        
    }
    

    
}