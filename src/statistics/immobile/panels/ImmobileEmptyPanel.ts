interface IImmobileEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const ImmobileEmptyPanelBindings: IImmobileEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class ImmobileEmptyPanelChanges implements ng.IOnChangesObject, IImmobileEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class ImmobileEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onImmobileAdd: () => void;
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
        if (this.onImmobileAdd) {
            this.onImmobileAdd();
        }
    }
}

(() => {
    angular
        .module('iqsImmobileEmptyPanel', [])
        .component('iqsImmobileEmptyPanel', {
            bindings: ImmobileEmptyPanelBindings,
            templateUrl: 'statistics/immobile/panels/ImmobileEmptyPanel.html',
            controller: ImmobileEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
