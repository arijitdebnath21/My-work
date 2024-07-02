import { LightningElement, api, track, wire } from 'lwc';
import getContact from '@salesforce/apex/score_CrewContactCtrl.getContact';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';


export default class Score_contactDetails extends LightningElement {

    recordId = '0032w00001LVjgfAAD';

    // @api recordId;
    // @api objectApiName;

    // Define the fields to be displayed
    PIFields = ['Name','Salutation','FirstName','LastName','Preferred_First_Name__c','Preferred_Last_Name__c','Email','Address__c','Confirmation_to_Send_SMS_to_Your_Phone__c',
    'Country_of_Citizenship__c','Do_you_parmanently_reside_outside__c','Nationality__c','Date_of_Birth__c','Gender__c','Race_Ethnicity__c','Veteran_Status__c',
    'Gender_Identity__c'];
    name; title; firstName; lastName;
    preferredFirstName; preferredLastName; email; address; confirmationSendSMSPhone; countryCitizenship;
    doYouParmanentlyResideOutside; nationality; dob;gender;raceEthnicity;veteranStatus;genderIdentity;

    // connectedCallback() {
    //     this.loadEventDetails();
    // }

    // loadEventDetails() {
    //     getContact({ conId: this.recordId })
    //         .then(result => {
	// 			this.name = result.Name;
    //             this.title = result.Salutation;
    //             this.firstName = result.FirstName;
    //             this.lastName = result.LastName;
    //             this.preferredFirstName = result.Preferred_First_Name__c;
    //             this.preferredLastName = result.Preferred_Last_Name__c;
    //             this.email = result.Email;
    //             this.address = result.Address__c;
    //             this.confirmationSendSMSPhone = result.Confirmation_to_Send_SMS_to_Your_Phone__c;
    //             this.countryCitizenship = result.Country_of_Citizenship__c;
    //             this.doYouParmanentlyResideOutside = result.Do_you_parmanently_reside_outside__c;
    //             this.nationality = result.Nationality__c;
    //             this.dob = this.formatDate(result.Date_of_Birth__c);
    //             this.gender = result.Gender__c;
    //             this.raceEthnicity = result.Race_Ethnicity__c;
    //             this.veteranStatus = result.Veteran_Status__c;
    //             this.genderIdentity = result.Gender_Identity__c;
    //         })
    //         .catch(error => {
    //             console.error('Error fetching event details: ', error);
    //             this.error = error;
    //         });
    // }

    // PI
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    wiredContactInfoForTravel({ error, data }) {
        if (data) {
            const eFields = data.fields;
            this.PIFields = this.PIFields.map(PIFieldName => ({
                PIFieldName,
                PILabel: eFields[PIFieldName].label
            }));
        } else if (error) {
            console.error('Error fetching contact fields:', error);
        }
    }

    formatDate(selectedDate) {
            const dateObj = new Date(selectedDate);
            const options = { day: '2-digit', month: 'short', year: 'numeric' };

            // Format the date in dd-mmm-yyyy format
            return dateObj.toLocaleDateString('en-US', options);
    }


    @track isContentVisibleForPI = true;

    // Method to toggle content visibility - events / position / emp details
    toggleContentVisibilityForPI() {
        this.isContentVisibleForPI = !this.isContentVisibleForPI;
    }

    // Getter method to return CSS class based on content visibility - events / position / emp details
    get contentWrapperClassForPI() {
        return this.isContentVisibleForPI ? 'slds-show' : 'slds-hide';
    }

    // Getter method to return arrow icon name based on content visibility - events / position / emp details
    get arrowIconNameForPI() {
        return this.isContentVisibleForPI ? 'utility:up' : 'utility:down';
    }
}