import Shepherd from 'tether-shepherd'
import DbUtil from './DbUtil'

function shouldTour() {
    return true
}

var tour = new Shepherd.Tour({
    defaults: {
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        scrollTo: true
    }
})

function runGuide() {
    tour.addStep('myfiles-menu', {
        text: '<h1 class="tour-steps"><span>1</span>/5</h1>Click on My Files to browser your folders and files',
        attachTo: '.myfiles-menu right',
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
        buttons: [{
            text: 'Exit',
            classes: 'shepherd-button-secondary',
            action: tour.cancel
        },{
            text: 'Next',
            classes: 'shepherd-button-example-primary',
            action: tour.next
        }]
    }).addStep('newfolder', {
        text: '<h1 class="tour-steps"><span>2</span>/5</h1>Create a new folder before uploading',
        attachTo: '.newfolder bottom',
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
        buttons: [{
            text: 'Exit',
            classes: 'shepherd-button-secondary',
            action: tour.cancel
        },{
            text: 'Next',
            classes: 'shepherd-button-example-primary',
            action: tour.next
        }]
    }).addStep('upload-menu', {
        text: '<h1 class="tour-steps"><span>3</span>/5</h1>Click Upload to transfer files',
        attachTo: '.upload-menu right',
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
        buttons: [{
            text: 'Exit',
            classes: 'shepherd-button-secondary',
            action: tour.cancel
        },{
            text: 'Next',
            classes: 'shepherd-button-example-primary',
            action: tour.next
        }]
    }).addStep('download-history', {
        text: '<h1 class="tour-steps"><span>4</span>/5</h1>Click download history to see your previous transactions',
        attachTo: '.download-history right',
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
        buttons: [{
            text: 'Exit',
            classes: 'shepherd-button-secondary',
            action: tour.cancel
        },{
            text: 'Next',
            classes: 'shepherd-button-example-primary',
            action: tour.next
        }]
    })

    tour.addStep('account-info', {
        text: '<h1 class="tour-steps"><span>5</span>/5</h1>Click here to view your account info',
        attachTo: '.demo-avatar-badge bottom',
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
        buttons: [{
            text: 'Done',
            action: tour.next
        }]
    })

    tour.start()
}

var stepCount = 0
function stepReady(step) {
    stepCount ++
    if(DbUtil.isFirstTime && stepCount === 5 ) [
        runGuide()
    ]
}

export {
    stepReady
}