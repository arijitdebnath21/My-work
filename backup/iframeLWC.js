import { LightningElement, track, wire } from 'lwc';
import fetchContactDataFromOrg2 from '@salesforce/apex/Org2DataFetcher.fetchContactDataFromOrg2';

export default class IframeLWC extends LightningElement {

    @track isModalOpen = false;
    contacts = [];

    @wire(fetchContactDataFromOrg2)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data.contacts;
             console.log(data.contacts);
        } else if (error) {
            console.error('Error fetching contact data:', error);
        }
    }

    openModal() {
        this.isModalOpen = true;
    }

    hideModalBox() {
        this.isModalOpen = false;
    }

}