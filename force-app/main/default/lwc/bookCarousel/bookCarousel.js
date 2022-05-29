import { LightningElement,api,track } from 'lwc';
import getRecentBooks from '@salesforce/apex/BookController.getRecentBooks'
import getBestsellers from '@salesforce/apex/BookController.getBestsellers'

export default class BookCarousel extends LightningElement {
    @api numberOfBooksToDisplay;
    @api headerText
    @api isReversed
    @api whatBooks
    @api intervalTime
    @track carouselItems=[]
    @track carouselBtns=[]
    // label=headingX;
    error ;
    books;
    previousCarouselItem=0;
    currentCarouselItem=0
    interval;
    async getBooks(){
        try{
            switch(this.whatBooks){
                case 'recentBooks':
                    this.books=await getRecentBooks({numberOfBooks: this.numberOfBooksToDisplay});
                    break;
                case 'bestsellers':
                    this.books=await getBestsellers({numberOfBooks: this.numberOfBooksToDisplay});
                    break;
                default:   
                    this.books=await getRecentBooks({numberOfBooks: this.numberOfBooksToDisplay});
                    break; 
            }           
        }catch(error){
            this.error=error;
        }
    }
    renderedCallback(){
        try {
            this.carouselItems =this.template.querySelectorAll('.carousel__item')
            this.carouselBtns=this.template.querySelectorAll('.carousel__button')
            console.log(this.carouselItems.length);
            if(this.carouselItems.length&& this.carouselBtns.length){
                
                this.changeCarouselItem()       
                this.carouselBtns[this.previousCarouselItem].classList.add('carousel__button--selected')
                this.makeIntervalGreatAgain();
               
            }
        } catch (error) {
            console.error(error)
        }
    }
    connectedCallback(){
        this.getBooks();
        
    }
    disconnectedCallback(){
        clearInterval(this.interval);
    }
    
    makeIntervalGreatAgain(){
        this.interval=setInterval(()=>{
            this.carouselBtns[this.previousCarouselItem].classList.remove('carousel__button--selected')
            this.previousCarouselItem=this.currentCarouselItem
            
            if(this.currentCarouselItem<this.books.length-1){
                
                this.currentCarouselItem++;
            }else{
                this.currentCarouselItem=0;
                
            }
            this.template.querySelectorAll('.carousel__button')[this.currentCarouselItem].classList.add('carousel__button--selected')
            this.changeCarouselItem()
        },this.intervalTime)
    }
    selectCarouselItem(event){
        this.previousCarouselItem = this.currentCarouselItem;
        this.currentCarouselItem=event.target.dataset.id;
        clearInterval(this.interval);
        this.makeIntervalGreatAgain()
        this.changeCarouselItem();    
        
        event.target.classList.add('carousel__button--selected')
    }

    changeCarouselItem(){
        console.log('cci: ',this.carouselItems.length)
        let isEqual=this.currentCarouselItem===this.previousCarouselItem
        switch(this.isReversed){
            case false:
                this.carouselItems[this.currentCarouselItem].classList.add('carousel__item--selected')
                
                !isEqual&&this.carouselItems[this.previousCarouselItem].classList.remove('carousel__item--selected')
                break;
            case true:
                this.carouselItems[this.currentCarouselItem].classList.add('carousel__item--reversed-selected')
                !isEqual&&this.carouselItems[this.previousCarouselItem].classList.remove('carousel__item--reversed-selected')
                break;

        }

        
        
        
        this.template.querySelectorAll('.carousel__button')[this.previousCarouselItem].classList.remove('carousel__button--selected')     
    }
}