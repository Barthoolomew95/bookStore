import { LightningElement } from 'lwc';
import registerUser from '@salesforce/apex/CommunityAuthController.registerUser'

export default class CustomRegister extends LightningElement {
    pageUrl;
    error;
    email;
    firstName;
    lastName;
    password;
    confirmPassword
    register(e){
        e.preventDefault();
        try {
            if(this.passwordValidation()){
                registerUser({firstName:this.firstName,lastName:this.lastName,email:this.email,password:this.password,startUrl:window.location.href}).then(result => {
                    window.open(result,'_self')
                }).catch(err => this.error=err.body.message);
            }
        } catch (error) {
            console.error(error)
        }
    }
    handleEmailChange(event){
        this.email = event.target.value;
    }
    handlePasswordChange(event){    
        this.password = event.target.value;      
    }
    handleConfirmPasswordChange(event){   
        this.confirmPassword = event.target.value;     
    }
    handleFirstNameChange(event){
        this.firstName = event.target.value;
    }
    handleLastNameChange(event){
        this.lastName = event.target.value;
    }
    navigateToLoginPage(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Login',
            }
        });
    }
    passwordValidation(){
        if(this.password!=this.confirmPassword){
            this.error='Passwords must be the same!'
            return false
        }
        if(this.password.length<8||this.password===null){
            this.error='Password length must be greater than 8 characters'
            return false
        }
        try{
            let password = this.password.split('');
            let specialChars=password.filter(char=>{           
                const asciiNumber=char.charCodeAt(0)
                //special sings in ascii are between: 32-48 && 57-65 && 90-97 && 122-127
                if((asciiNumber>32&&asciiNumber<48)||(asciiNumber>57&&asciiNumber<65)||(asciiNumber>90&&asciiNumber<97)||(asciiNumber>122&&asciiNumber<127)){
                    return true;
                }
            })
           
            if(specialChars.length===0){
                this.error='Password must have at least one special Character!'
                return false
            }
    
            let numeric=password.filter(char=>{
                const asciiNumber=char.charCodeAt(0)
                //numerics in ascii are between: 47-58
                if(asciiNumber>47&&asciiNumber<58){
                    return true;
                }
            })
            if(numeric.length===0){
                this.error='Password must have at least one numeric character'
                return false
            }
    
            let capital=password.filter(char=>{
                const asciiNumber=char.charCodeAt(0)
                //Capital letters in ascii are between: 64-91
                if(asciiNumber>64&&asciiNumber<91){
                    return true;
                }
            })
            if(capital.length===0){
                this.error='Password must have at least one capital character'
                return false
            }
        }catch(error){
            console.error(error)
        }
        return true

    }
}