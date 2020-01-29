interface ISpeedEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const SpeedEmptyPanelBindings: ISpeedEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class SpeedEmptyPanelChanges implements ng.IOnChangesObject, ISpeedEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class SpeedEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onSpeedAdd: () => void;
    public state: string;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService
    ) {
        "ngInject";

        $element.addClass('iqs-object-params-empty-panel');
    }

    public onAdd(): void {
        if (this.onSpeedAdd) {
            this.onSpeedAdd();
        }
    }
}

(() => {
    angular
        .module('iqsSpeedEmptyPanel', [])
        .component('iqsSpeedEmptyPanel', {
            bindings: SpeedEmptyPanelBindings,
            templateUrl: 'statistics/speed/panels/SpeedEmptyPanel.html',
            controller: SpeedEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
