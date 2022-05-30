trigger OrderStatusValidation on bs_order__c (before update) {
	for( Id orderId : Trigger.newMap.keySet() ){
            if( Trigger.oldMap.get(orderId).Status__c =='Canceled'&&trigger.newMap.get(orderId).Status__c!='Canceled'){
                trigger.newMap.get(orderId).Status__c.addError('The order was canceled,so you can\'t change it');
            }
        }
}