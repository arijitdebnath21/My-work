import { LightningElement, api, track, wire } from 'lwc';
import { MessageContext,publish, subscribe, unsubscribe} from 'lightning/messageService';
import Counting_Update from '@salesforce/messageChannel/Counting_Update__c';

import getAccreditation from '@salesforce/apex/score_CrewContactCtrl.getAccreditation';
import getContactWithAttachment from '@salesforce/apex/score_ContactController.getContactWithAttachment';
import getContentDocumentId from '@salesforce/apex/score_ContactController.getContentDocumentId';
import getRelatedFilesByRecordId from '@salesforce/apex/score_CrewContactCtrl.getRelatedFilesByRecordId';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import Email_FIELD from '@salesforce/schema/Contact.Email';
import Accepted_Photo from '@salesforce/resourceUrl/Accepted_Photo';
import Rejected_Photo from '@salesforce/resourceUrl/Rejected_Photo';
import photoVerificationStatus from '@salesforce/apex/score_ContactController.photoVerificationStatus';
import { updateRecord } from 'lightning/uiRecordApi';
import CONTACT from '@salesforce/schema/Contact';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getFieldValue } from "lightning/uiRecordApi";
import PHOTE_VERIFICATION_FIELD from "@salesforce/schema/Contact.Photo_Verification__c";


export default class Score_photo_travel extends LightningElement {


    @api recordId = '0032w00001LVjgfAAD';
    // @api objectApiName = CONTACT;
    accepted_Photo = Accepted_Photo;
    rejected_Photo = Rejected_Photo;
    isShowModal = false;
    isShowModal2 = false;
    approveRejectButtonOpacity = false;
    opacityDecrease='';
    showApproveRejectText = false;
    alreadyApprovedOrRejected=false;
    filesList = [];
    subcription=null;
    editInOperation=false;
    // approveRejectMsg='';

    fields = [NAME_FIELD,Email_FIELD];

    connectedCallback() {
        setTimeout(() => {
            this.approveRejectCheck()
         }, 0);

         this.handleSubscribe();
    }
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    // photo - attachment
    @wire(getContactWithAttachment, { contactId: '$recordId' })
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data.contact;
            console.log(this.contact);
            this.documentUrl = data.documentUrl;
            this.versionId = data.versionId;
            console.log('documentUrl '+this.documentUrl);
            console.log('documentId '+this.versionId);
        } else if (error) {
            this.error = error;
            console.error('Error retrieving contact: ', error);
        }
    }

    formatDate(selectedDate) {
            const dateObj = new Date(selectedDate);
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return dateObj.toLocaleDateString('en-US', options);
    }

    @track isContentVisibleForPhoto = true;
    
    // Method to toggle content visibility 
    toggleContentVisibilityForPhoto() {
        this.isContentVisibleForPhoto = !this.isContentVisibleForPhoto;
    }

    // Getter method to return CSS class based on content visibility 
    get contentWrapperClassForPhoto() {
        return this.isContentVisibleForPhoto ? 'slds-show' : 'slds-hide';
    }

    // Getter method to return arrow icon name based on content visibility 
    get arrowIconNameForPhoto() {
        return this.isContentVisibleForPhoto ? 'utility:up' : 'utility:down';
    }

    openPopUpForImagePreview(){
		this.isShowModal = true;
	}
    openPopUpForAcceptanceCriteria(){
		this.isShowModal2 = true;
	}
		
	hideModalBoxForImagePreview() {  
        this.isShowModal = false;
    }
    hideModalBoxForAcceptanceCriteria() {  
        this.isShowModal2 = false;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    // Called from connectedCallback to check if photo is already approved/rejected
    approveRejectCheck() { 
        photoVerificationStatus({ recordId: this.recordId })
            .then(result => {
                if(result == 'Approved')
                {
                    // console.log('in js ',result);
                    // this.approveRejectMsg = 'This photo is already been approved. Therefore, further modifications are not allowed';
                    this.opacityDecrease = "opacity: 0.5"
                    this.alreadyApprovedOrRejected = true;
                }
                else if(result == 'Rejected')
                {
                    // console.log('in js ',result);
                    // this.approveRejectMsg = 'This photo is already been rejected. Therefore, further modifications are not allowed';
                    this.opacityDecrease = "opacity: 0.5"
                    this.alreadyApprovedOrRejected = true;
                }
            })
            .catch(error => {
                console.error('Error updating field:', error);
            });
    }

    approve_photo() {
            if(this.alreadyApprovedOrRejected == false ){
                const fields = {};
                fields.Id = this.recordId;
                fields.Photo_Verification__c = 'Approved';
                const recordInput = { fields };

                updateRecord(recordInput)
                    .then((result) => {
                            this.showToast('Success', 'The status has been successfully updated', 'success');
                            this.custumEventCall(getFieldValue(result, PHOTE_VERIFICATION_FIELD));
                    })
                    .catch(error => {
                            this.showToast('Error', 'Error occurred', 'error');
                    });

                this.opacityDecrease = "opacity: 0.5";
                this.alreadyApprovedOrRejected = true;
           }
    }

    reject_photo() {
        if(this.alreadyApprovedOrRejected == false ){
            const fields = {};
            fields.Id = this.recordId;
            fields.Photo_Verification__c = 'Rejected';
            const recordInput = { fields };

            updateRecord(recordInput)
                .then((result) => {
                    this.showToast('Success', 'The status has been successfully updated', 'success');
                    this.custumEventCall(getFieldValue(result, PHOTE_VERIFICATION_FIELD));
                })
                .catch(error => {
                    this.showToast('Error', 'Error occurred', 'error');
                });
            this.opacityDecrease = "opacity: 0.5";
            this.alreadyApprovedOrRejected = true;
        }
    }

// download part (fetching the photo)
    @wire(getRelatedFilesByRecordId, {recordId : '$recordId'})
    wiredResult({ data, error }) {
        if (data) {
            this.filesList = Object.keys(data).map(item => ({
                label: data[item],
                value: item,
                url: `/sfc/servlet.shepherd/document/download/${item}`
            }));
        } else if (error) {
            console.error('Error fetching files:', error);
        }
    }

    handleDownload(event) {
        // Get the URL of the file to be downloaded
        const fileUrl = event.target.dataset.url;

        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'Image.png'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    custumEventCall(status){
        const dataPassEvt = new CustomEvent('passphotodataevent', {
                                                bubbles: true,
                                                composed: true,
                                                detail: { photoApprovalmessage: status }
                                            });
        this.dispatchEvent(dataPassEvt);
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

    // edit part - publish
    handleEditChange() {
        // this.parentData = false;
        this.editInOperation=true;
        let payload = {editInOperationDataPass:this.editInOperation};

        publish(this.messageContext, Counting_Update, payload)
    }
    
}