import { LightningElement,track } from 'lwc';
export default class Calender extends LightningElement {
    dataForFour='(Add Note)';
    isdataForFour = true;
    isAddNoteFour = false;
    isSunday;

    addNoteFour(event){
        this.isAddNoteFour = true;
    }

    connectedCallback() {
        this.isAddNoteFour = false;
        // this.isdataForFour = false;
    }

    handleChangeForFour(event){
        this.dataForFour = event.target.value;
        // this.isdataForFour = true;
    }

    closeInputForFour(){
        this.isAddNoteFour = false;
    }




    /////////////////////////////////////////////

    @track year;
    @track month;
    @track weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    @track weeks = [];

    connectedCallback() {
        const currentDate = new Date();
        this.year = currentDate.getFullYear();
        this.month = currentDate.getMonth();
        this.generateCalendar();
    }

    generateCalendar() {
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
        let days = [];

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        this.weeks = [];
        let week = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(this.year, this.month, i).getDay();
            week.push(i);
            if (currentDay === 6 || i === daysInMonth) {
                this.weeks.push(week);
                week = [];
            }
        }
    }

    // isSunday() {
    //     if(weekday === 'Sunday'){
    //         console.log(weekday);
    //         return true;
    //     }
    //     return false;
    // }
    checkSunday(weekday) {
        if(weekday === 'Sunday'){
            this.isSunday=true;
        }
        else
        this.isSunday=false;
    }
}