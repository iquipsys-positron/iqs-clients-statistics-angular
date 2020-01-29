interface IObjectParamsEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const ObjectParamsEmptyPanelBindings: IObjectParamsEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class ObjectParamsEmptyPanelChanges implements ng.IOnChangesObject, IObjectParamsEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class ObjectParamsEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onObjectParamsAdd: () => void;
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
        if (this.onObjectParamsAdd) {
            this.onObjectParamsAdd();
        }
    }
}

(() => {
    angular
        .module('iqsObjectParamsEmptyPanel', [])
        .component('iqsObjectParamsEmptyPanel', {
            bindings: ObjectParamsEmptyPanelBindings,
            templateUrl: 'statistics/object_params/panels/ObjectParamsEmptyPanel.html',
            controller: ObjectParamsEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
