interface IFreezedEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const FreezedEmptyPanelBindings: IFreezedEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class FreezedEmptyPanelChanges implements ng.IOnChangesObject, IFreezedEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class FreezedEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onFreezedAdd: () => void;
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
        if (this.onFreezedAdd) {
            this.onFreezedAdd();
        }
    }
}

(() => {
    angular
        .module('iqsFreezedEmptyPanel', [])
        .component('iqsFreezedEmptyPanel', {
            bindings: FreezedEmptyPanelBindings,
            templateUrl: 'statistics/freezed/panels/FreezedEmptyPanel.html',
            controller: FreezedEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
