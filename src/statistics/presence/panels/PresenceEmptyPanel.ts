interface IPresenceEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const PresenceEmptyPanelBindings: IPresenceEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class PresenceEmptyPanelChanges implements ng.IOnChangesObject, IPresenceEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

     state: ng.IChangesObject<string>;
}

class PresenceEmptyPanelController implements ng.IController {          public $onInit() {}
    public onPresenceAdd: () => void;
    public state: string;
    public accessConfig: any;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService
    ) {
        "ngInject";
        
        $element.addClass('iqs-object-params-empty-panel');
    }

    public onAdd(): void {
        if (this.onPresenceAdd) {
            this.onPresenceAdd();
        }
    }
}

(() => {
    angular
        .module('iqsPresenceEmptyPanel', [])
        .component('iqsPresenceEmptyPanel', {
            bindings: PresenceEmptyPanelBindings,
            templateUrl: 'statistics/presence/panels/PresenceEmptyPanel.html',
            controller: PresenceEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
