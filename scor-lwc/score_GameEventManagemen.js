import { LightningElement, api, track, wire } from 'lwc';
import { MessageContext,publish, subscribe, unsubscribe} from 'lightning/messageService';
import Counting_Update from '@salesforce/messageChannel/Counting_Update__c';

import getAccreditation from '@salesforce/apex/score_CrewContactCtrl.getAccreditation';
import getContactWithAttachment from '@salesforce/apex/score_ContactController.getContactWithAttachment';
import getTravelDetails from '@salesforce/apex/score_CrewContactCtrl.getTravelDetails';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import Email_FIELD from '@salesforce/schema/Contact.Email';
import Accepted_Photo from '@salesforce/resourceUrl/Accepted_Photo';
import Rejected_Photo from '@salesforce/resourceUrl/Rejected_Photo';
import approveRejectStatus from '@salesforce/apex/score_ContactController.approveRejectStatus';
import { updateRecord, getFieldValue } from 'lightning/uiRecordApi';
import CONTACT from '@salesforce/schema/Contact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import HR_APP_FIELD from "@salesforce/schema/Contact.HR_App__c";

export default class Score_GameEventManagemen extends LightningElement {

    recordId = '0032w00001LVjgfAAD';
    @api objectApiName = CONTACT;
    accepted_Photo = Accepted_Photo;
    rejected_Photo = Rejected_Photo;
    isShowModal = false;
    approveRejectButtonOpacity = false;
    opacityDecrease='';
    showApproveRejectText = false;
    alreadyApprovedOrRejected = false;
    subcription=null;
    editInOperation=false;

    fields = [NAME_FIELD,Email_FIELD];

    // Define the fields to be displayed
    accreditationFields = ['Citizenship__c', 'I_have_more_than_one_citizenship__c', 'Legal_First_Name__c', 'Legal_Last_Name__c', 'Country_of_Birth__c','City_of_Birth__c', 'Do_you_use_a_wheelchair__c','My_Identity_Document__c'];

    connectedCallback() {        
        setTimeout(() => {
            this.approveRejectCheck()
         }, 0);

        this.handleSubscribe();
    }
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    // Accreditation
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    wiredContactInfoForAccreditation({ error, data }) {
        if (data) {
            const eFields = data.fields;
            this.accreditationFields = this.accreditationFields.map(accreditationFieldName => ({
                accreditationFieldName,
                accreditationLabel: eFields[accreditationFieldName].label
            }));
        } else if (error) {
            console.error('Error fetching contact fields:', error);
        }
    }

    // loadEventDetails() {  // from connectedCallback
    //     getAccreditation({ conId: this.recordId })
    //         .then(result => {
	// 			this.citizenship = result.Citizenship__c;
    //             this.moreThanOneCitizenship = result.I_have_more_than_one_citizenship__c;
    //             this.legalFirstName = result.Legal_First_Name__c;
    //             this.legalLastName = result.Legal_Last_Name__c;
    //             this.countryBirth = result.Country_of_Birth__c;
    //             this.cityOfBirth = result.City_of_Birth__c;
    //             this.wheelchair = result.Do_you_use_a_wheelchair__c;
    //             this.identityDocument = result.My_Identity_Document__c;
                
    //         })
    //         .catch(error => {
    //             console.error('Error fetching event details: ', error);
    //             this.error = error;
    //         });
    // }

    formatDate(selectedDate) {
            const dateObj = new Date(selectedDate);
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return dateObj.toLocaleDateString('en-US', options);
    }


    @track isContentVisibleForAccreditation = true;

    // Method to toggle content visibility -
    toggleContentVisibilityForAccreditation() {
        this.isContentVisibleForAccreditation = !this.isContentVisibleForAccreditation;
    }

    // Getter method to return CSS class based on content visibility - 
    get contentWrapperClassForAccreditation() {
        return this.isContentVisibleForAccreditation ? 'slds-show' : 'slds-hide';
    }
    
    // Getter method to return arrow icon name based on content visibility -
    get arrowIconNameForAccreditation() {
        return this.isContentVisibleForAccreditation ? 'utility:up' : 'utility:down';
    }
    
    // Called from connectedCallback to check if registration is already approved/rejected
    approveRejectCheck() {  
        approveRejectStatus({ recordId: this.recordId })
            .then(result => {
                if(result == 'Cancelled' || result == 'Approved')
                {
                    console.log('in js ',result);
                    this.opacityDecrease = "opacity: 0.5"
                    this.alreadyApprovedOrRejected = true;
                }
            })
            .catch(error => {
                console.error('Error updating field:', error);
            });
    }

    approve() {
        if(this.alreadyApprovedOrRejected == false ){
            const fields = {};
            fields.Id = this.recordId;
            fields.HR_App__c = 'Approved'; 
            const recordInput = { fields };

            updateRecord(recordInput)
                .then((result) => {
                    this.showToast('Success', 'The status has been successfully updated', 'success');
                    
                    this.custumEventCall(getFieldValue(result, HR_APP_FIELD));
                })
                .catch(error => {
                    console.log('error: '+JSON.stringify(error));
                    this.showToast('Error', 'Error occurred', 'error');
                });

            this.opacityDecrease = "opacity: 0.5";
            this.alreadyApprovedOrRejected = true;
        }
    }

    reject() {
        if(this.alreadyApprovedOrRejected == false ){
            const fields = {};
            fields.Id = this.recordId;
            fields.HR_App__c = 'Cancelled'; 
            const recordInput = { fields };

            updateRecord(recordInput)
                .then((result) => {
                    this.showToast('Success', 'The status has been successfully updated', 'success');
                    this.custumEventCall(getFieldValue(result, HR_APP_FIELD));
                })
                .catch(error => {
                    this.showToast('Error', 'Error occurred', 'error');
                });
            this.opacityDecrease = "opacity: 0.5";
            this.alreadyApprovedOrRejected = true;
        }
    }

    custumEventCall(status){
        const dataPassEvt = new CustomEvent('passdataevent', {
                                                bubbles: true,
                                                composed: true,
                                                detail: { hrApprovalmessage: status }
                                            });
        this.dispatchEvent(dataPassEvt);
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

// edit part - publish

    @wire (MessageContext) messageContext;

    handleEditChange() {
        this.editInOperation=true;

        let payload = {editInOperationDataPass:this.editInOperation};

        publish(this.messageContext, Counting_Update, payload)
    }

    // edit part - subscribe
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