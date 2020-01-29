interface IObjectEventsEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const ObjectEventsEmptyPanelBindings: IObjectEventsEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class ObjectEventsEmptyPanelChanges implements ng.IOnChangesObject, IObjectEventsEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class ObjectEventsEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onObjectEventsAdd: () => void;
    public state: string;
    public accessConfig: any;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService
    ) {
        "ngInject";

        $element.addClass('iqs-object-events-empty-panel');
    }

    public onAdd(): void {
        if (this.onObjectEventsAdd) {
            this.onObjectEventsAdd();
        }
    }
}

(() => {
    angular
        .module('iqsObjectEventsEmptyPanel', [])
        .component('iqsObjectEventsEmptyPanel', {
            bindings: ObjectEventsEmptyPanelBindings,
            templateUrl: 'statistics/object_events/panels/ObjectEventsEmptyPanel.html',
            controller: ObjectEventsEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
