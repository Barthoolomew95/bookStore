import uId from '@salesforce/user/Id';

    function updateUserCartInLocalStorage(userCartToUpdate){
        let usersCarts=getUsersCarts();
        let cartIndex=usersCarts.findIndex(userCart=> userCart.userId===userCartToUpdate.userId);
        if(cartIndex<0){
            usersCarts.push(userCartToUpdate);
        }else{
            usersCarts[cartIndex]=userCartToUpdate;
        }
        window.localStorage.setItem('usersCarts', JSON.stringify(usersCarts))
    }

    function getUserCartFromLocalStorage(){
        let usersCarts=getUsersCarts();
        let emptyUserCart = {
            userId:uId,
            cartItems:[],
            cartQuantity:0,
        };
        if(usersCarts.length>0){
            let currentUserCart=usersCarts.find(userCart=> userCart.userId===uId)
            if(currentUserCart!=undefined) {
                return currentUserCart;
            }else{
                return emptyUserCart;
            }
        }else{
            return emptyUserCart;
        }
    
    }
    function getCartItemsForUser(){
        let usersCarts= getUsersCarts();
        if(usersCarts.length!=0){
            let userCart= usersCarts.find(userCart=>userCart.userId==uId)
            return userCart.cartItems?userCart.cartItems:[]
        }else return []
    }
    function getUsersCarts(){ 
        return window.localStorage.getItem('usersCarts')?JSON.parse(window.localStorage.getItem('usersCarts')):[];
    }
    function getCartQuantity(){ 
        let usersCarts=getUsersCarts();
        if(usersCarts.length!=0){
           let userCart= usersCarts.find(userCart=>userCart.userId==uId)
           return userCart?userCart.cartQuantity:0
        }else return 0
    }
    function clearUserCart(){ 
        let userCart=getUserCartFromLocalStorage()
        userCart.cartItems=[];
        userCart.cartQuantity=0;
        updateUserCartInLocalStorage(userCart)
    }
    function deleteItemFromUserCart(bookId){ 
        try{
           
            let userCart=getUserCartFromLocalStorage()
            
            let indexOfitem= userCart.cartItems.findIndex(item=>item.bookId==bookId);
            
            if(indexOfitem>=0){
                
                userCart.cartQuantity-=userCart.cartItems[indexOfitem].amountOfBook
                userCart.cartItems.splice(indexOfitem,1)
                
            }
            
            updateUserCartInLocalStorage(userCart);

        }catch(e){
            console.error(error);
        }
        
    }
    function updateItemFromUserCart(bookId,amount){ 
        try{
            
            let userCart=getUserCartFromLocalStorage()
            
            let indexOfitem= userCart.cartItems.findIndex(item=>item.bookId==bookId);
            
            if(indexOfitem>=0){
                
                let amounTtoCorrect=amount-userCart.cartItems[indexOfitem].amountOfBook
                userCart.cartQuantity+=amounTtoCorrect
                userCart.cartItems[indexOfitem].amountOfBook=amount;
                
            }
            
            updateUserCartInLocalStorage(userCart);

        }catch(e){
            console.error(error);
        }
        
    }
    function getIndexOfItemInUserCart(itemId){        
   
    }


export  {getUsersCarts,getUserCartFromLocalStorage,updateUserCartInLocalStorage,getCartQuantity,getCartItemsForUser,clearUserCart,deleteItemFromUserCart,updateItemFromUserCart}