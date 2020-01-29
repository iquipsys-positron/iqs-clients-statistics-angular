interface IDistanceEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const DistanceEmptyPanelBindings: IDistanceEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class DistanceEmptyPanelChanges implements ng.IOnChangesObject, IDistanceEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class DistanceEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onDistanceAdd: () => void;
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
        if (this.onDistanceAdd) {
            this.onDistanceAdd();
        }
    }
}

(() => {
    angular
        .module('iqsDistanceEmptyPanel', [])
        .component('iqsDistanceEmptyPanel', {
            bindings: DistanceEmptyPanelBindings,
            templateUrl: 'statistics/distance/panels/DistanceEmptyPanel.html',
            controller: DistanceEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
