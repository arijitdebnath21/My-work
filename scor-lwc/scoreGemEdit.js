import { LightningElement, api, wire } from 'lwc';
import getContactWithAttachment from '@salesforce/apex/score_ContactController.getContactWithAttachment';
import approveRejectStatus from '@salesforce/apex/score_ContactController.approveRejectStatus';
import getStatuses from '@salesforce/apex/score_ContactController.getStatuses';

export default class ScoreGemEdit extends LightningElement {
    @api recordId = '0032w00001LVjgfAAD';
    @api hrStatus;
    @api photoStatus;
    contact;
    documentUrl;
    error;
    lastModDate;
    navColor = "background-color: rgb(34, 125, 253)";

    aboutYouColor = this.navColor;
    eventRegColor='';
    revSubmitColor='';
    
    connectedCallback() {
        console.log('Connected callback');
        this.checkStatuses();
        
    }

    @wire(getContactWithAttachment, { contactId: '$recordId' })
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data.contact;
            this.lastModDate = this.formatDate(this.contact.LastModifiedDate); 
            this.documentUrl = data.documentUrl;
        } else if (error) {
            this.error = error;
            console.error('Error retrieving contact: ', error);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
        // return date.toLocaleDateString('en-US', options).replace(',', '');
    }

    get hrStatusClr(){
        return this.hrStatus == "Approved" ? "color:green;" : this.hrStatus == "Cancelled" ? "color:red;" :  "color:#FFA500;";
    }

    get photoStatusClr(){
        return this.photoStatus == "Approved" ? "color:green;" : this.photoStatus == "Rejected" ? "color:red;" :  "color:#FFA500;";
    }

    checkStatuses(){
        getStatuses({contactId: this.recordId}).then(result=>{
            this.hrStatus = result.approveRejectStatus;
            this.photoStatus = result.photoVerificationStatus;
        }).catch(error=>{
            console.log('error : '+error);
        });
    }

    aboutYou(){
        this.aboutYouColor = this.navColor;
        this.eventRegColor='';
        this.revSubmitColor='';
    }
    eventReg(){
        this.aboutYouColor = '';
        this.eventRegColor=this.navColor;
        this.revSubmitColor='';
    }
    revSubmit(){
        this.aboutYouColor = '';
        this.eventRegColor='';
        this.revSubmitColor=this.navColor;
    }

}