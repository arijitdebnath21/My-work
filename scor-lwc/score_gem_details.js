import { LightningElement, wire } from 'lwc';
import { MessageContext,publish, subscribe, unsubscribe} from 'lightning/messageService';
import Counting_Update from '@salesforce/messageChannel/Counting_Update__c';

export default class Score_gem_details extends LightningElement {

    greyClass1="background-color: rgb(84, 84, 84); color: white;"
	greyClass2=""

    openContactDetailspage = true;
	openGameEventManagementpage = false;

	@wire (MessageContext) messageContext;

    showClickedTemplate(event){
			this.makeDeafultFalse();
			if(event.currentTarget.dataset.name == 'Contact Details'){
					this.greyClass1 = "background-color: rgb(84, 84, 84); color: white;";
					this.greyClass2="";
					this.openContactDetailspage = true;
			}else if(event.currentTarget.dataset.name == 'Game Event Management'){
					this.openGameEventManagementpage = true;
					this.greyClass1="";
					this.greyClass2 = "background-color: rgb(84, 84, 84); color: white;";
			}

	// In the edit section, on click of 'contact details'c, it should go back from edit to before edit section.
        let payload = {editInOperationDataPass:false};
        publish(this.messageContext, Counting_Update, payload)
    
	}
	
		makeDeafultFalse(){
			this.openContactDetailspage = false;
			this.openGameEventManagementpage = false;
	}

	handlePassData(){
		
		this.hrApprovalStatus = event.detail.hrApprovalmessage;
		console.log('handlePassData of parent:'+this.hrApprovalStatus);
	}

	
	handlePhotoData(){
		console.log('handlePassData of parent');
	}
}