import { LightningElement, api, wire } from 'lwc';
import { MessageContext, subscribe, unsubscribe, publish} from 'lightning/messageService';
import Counting_Update from '@salesforce/messageChannel/Counting_Update__c';

import getContactWithAttachment from '@salesforce/apex/score_ContactController.getContactWithAttachment';
import approveRejectStatus from '@salesforce/apex/score_ContactController.approveRejectStatus';
import getStatuses from '@salesforce/apex/score_ContactController.getStatuses';
import LOADING_IMAGE from '@salesforce/resourceUrl/SpinnerLogo'; 

 

export default class Score_Crews extends LightningElement {
    @api recordId = '0032w00001LVjgfAAD';
    @api hrStatus;
    @api photoStatus;
    contact;
    documentUrl;
    error;
    mailtoLink;
    telLink;
    editInOperation=false;
    subcription=null;
    lastModDate;

    loadingImageUrl = LOADING_IMAGE;
    isloaded = false;
    
    connectedCallback() {
        console.log('Connected callback');
        this.checkStatuses();

        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    @wire(getContactWithAttachment, { contactId: '$recordId' })
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data.contact;
            this.lastModDate = this.formatDate(this.contact.LastModifiedDate); 
            setTimeout(() => {
                this.isloaded=true; /* NBC Logo Spinner */
                this.dispatchEvent(new CustomEvent('loadcomplete'));
               }, 3000);
            this.documentUrl = data.documentUrl;
            console.log(this.contact);
            this.mailtoLink = `mailto:${this.contact.Email}`;
            this.telLink = `tel:${this.contact.Phone}`
        } else if (error) {
            this.error = error;
            console.error('Error retrieving contact: ', error);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
        //         return date.toLocaleDateString('en-US', options).replace(',', '');
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

    // Image modalPopup JS
    isModalOpen = false;
    handleOpenPopUp(){
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }

    handleCloseModal() {
        this.isModalOpen = false;
        document.body.style.overflow = '';
    }

// edit part - subscribe
    @wire (MessageContext) messageContext;

    handleSubscribe(){
        if(!this.subcription){
            this.subcription=subscribe(this.messageContext, Counting_Update, 
                (parameter) => {
                    this.editInOperation=parameter.editInOperationDataPass;
                }
            );
        }
    }

    handleUnsubscribe(){
        unsubscribe(this.subcription);
        this.subcription=null;
    }

}