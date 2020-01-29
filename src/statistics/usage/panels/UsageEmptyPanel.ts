interface IUsageEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const UsageEmptyPanelBindings: IUsageEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class UsageEmptyPanelChanges implements ng.IOnChangesObject, IUsageEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class UsageEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onUsageAdd: () => void;
    public state: string;
    public accessConfig: any;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
    ) {
        "ngInject";

        $element.addClass('iqs-object-params-empty-panel');
    }

    public onAdd(): void {
        if (this.onUsageAdd) {
            this.onUsageAdd();
        }
    }
}

(() => {
    angular
        .module('iqsUsageEmptyPanel', [])
        .component('iqsUsageEmptyPanel', {
            bindings: UsageEmptyPanelBindings,
            templateUrl: 'statistics/usage/panels/UsageEmptyPanel.html',
            controller: UsageEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
