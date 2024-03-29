import { LightningElement,track } from 'lwc';
export default class Calender extends LightningElement {

    /* I have implemented this functionality: we can add notes to any particular date by double clicking on that date. On double clicking an
    input field appears and we can write a note there and on clicking on outside the calender the input field disappears and the note gets 
    visible below that particular date. (For eg: Meeting at 9 pm) */

    dataForFour='(Add Note)';
    isdataForFour = false;
    isAddNoteFour = false;

    addNoteFour(event){
        this.isAddNoteFour = true;
    }

    connectedCallback() {
        this.isAddNoteFour = false;
        //this.isdataForFour = false;
    }

    handleChangeForFour(event){
        this.dataForFour = event.target.value;
        this.isdataForFour = true;
    }

    closeInputForFour(){
        this.isAddNoteFour = false;
    }

}