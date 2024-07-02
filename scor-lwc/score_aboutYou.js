import { LightningElement, track } from 'lwc';


export default class Score_aboutYou extends LightningElement {
    @track step1Class = 'status-icon incomplete';
    @track step2Class = 'status-icon incomplete';
    @track step3Class = 'status-icon incomplete';
    @track step1Icon = 'utility:close';
    @track step2Icon = 'utility:close';
    @track step3Icon = 'utility:close';
    @track showStep1 = false;
    @track showStep2 = false;
    @track showStep3 = false;
    @track validItems1 = false;
    @track validItems3 = false;
    @track variantIcon = 'inverse';
     @track personalInformationStep1 = {};
    @track personalInformationStep2 = {};
    @track photo;
    @track isUploaded = false;
    @track recordId = "0032w00001LVjgfAAD";


    updateStepStatus(stepNumber, isValid) {
        const statusClass = isValid ? 'status-icon completed' : 'status-icon incomplete';
        const statusIcon = isValid ? 'utility:check' : 'utility:close';

        if (stepNumber === 1) {
            this.step1Class = statusClass;
            this.step1Icon = statusIcon;
        } else if (stepNumber === 2) {
            this.step2Class = statusClass;
            this.step2Icon = statusIcon;
        } else if (stepNumber === 3) {
            this.step3Class = statusClass;
            this.step3Icon = statusIcon;
        }
    }

    handleStep1Click() {
        this.showStep1 = !this.showStep1;
        if (!this.showStep1) {
            this.updateStepStatus(1, this.validItems1);
        }
    }

    handleStep2Click() {
        this.showStep2 = !this.showStep2;
        if (!this.showStep2) {
            this.updateStepStatus(2,  this.validItems);
        }
    }

    handleStep3Click() {
        this.showStep3 = !this.showStep3;
        if (!this.showStep2) {
            this.updateStepStatus(2,  this.validItems);
        }
    }

    handleNextStep1(event) {
        this.updateStepStatus(1, event.detail.valid);
        this.showStep1 = false;
        this.showStep2 = true;
    }

    handleNextStep2(event) {
        this.updateStepStatus(2, event.detail.valid);
        this.showStep2 = false;
        this.showStep3 = true;
    }

    handleNextStep3(event) {
        this.updateStepStatus(3, event.detail.valid);
        this.showStep3 = false;
    }

    handlePreviousStep1(event) {
        this.updateStepStatus(3, event.detail.valid);
        this.showStep1 = false;
    }

    handlePreviousStep2() {
        
        this.showStep2 = false;
        this.showStep1 = true;
    }

    handlePreviousStep3(event) {
        this.updateStepStatus(3, event.detail.valid);
        this.showStep3 = false;
        this.showStep2 = true;
    }

    handleFieldChange(event) {
        const { stepNumber, valid,fieldName, value } = event.detail;
         this.personalInformationStep1[fieldName] = value;
        console.log('@@@ event.detail' ,event.detail)
        this.validItems = valid;
        this.updateStepStatus(stepNumber, valid);
    }

    handleField2Change(event) {
        const { stepNumber, valid } = event.detail;
        this.validItems = valid;
        this.updateStepStatus(stepNumber, valid);
    }
    handleField3Change(event) {
        const { stepNumber, valid, value, hasError } = event.detail;
        console.log('has error@@ ',hasError);
        this.validItems3 = valid;
        this.photo = value;
        if (hasError) {
            this.validItems3 = false;
        }
        this.updateStepStatus(stepNumber, this.validItems3);
    }
    handleRemove(event){
        const { stepNumber, valid } = event.detail;
        this.validItems3 = valid;
        this.updateStepStatus(stepNumber, valid);
    }
    
}