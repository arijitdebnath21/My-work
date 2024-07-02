import { LightningElement, api, track, wire } from 'lwc';
import { MessageContext,publish, subscribe, unsubscribe} from 'lightning/messageService';
import Counting_Update from '@salesforce/messageChannel/Counting_Update__c';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class Score_travel extends LightningElement {

    recordId = '0032w00001LVjgfAAD';
    // Define the fields to be displayed
    travelFields = ['Departure_Airport_or_Station__c', 'Return_Airport_or_Station__c', 'Post_Extend_My_Travel__c', 'I_will_be_travelling_with_my_equipment__c'];
    
    subcription=null;
    editInOperation=false;

    connectedCallback() {
         this.handleSubscribe();
    }
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    // travel 
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    wiredContactInfoForTravel({ error, data }) {
        if (data) {
            const eFields = data.fields;
            this.travelFields = this.travelFields.map(travelFieldName => ({
                travelFieldName,
                travelLabel: eFields[travelFieldName].label
            }));
        } else if (error) {
            console.error('Error fetching contact fields:', error);
        }
    }

    @track isContentVisibleForTravel = true;

    // Method to toggle content visibility 
    toggleContentVisibilityForTravel() {
        this.isContentVisibleForTravel = !this.isContentVisibleForTravel;
    }

    // Getter method to return CSS class based on content visibility 
    get contentWrapperClassForTravel() {
        return this.isContentVisibleForTravel ? 'slds-show' : 'slds-hide';
    }

    // Getter method to return arrow icon name based on content visibility 
    get arrowIconNameForTravel() {
        return this.isContentVisibleForTravel ? 'utility:up' : 'utility:down';
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