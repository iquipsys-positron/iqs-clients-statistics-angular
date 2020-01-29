interface ISpeedTraceEmptyPanelBindings {
    [key: string]: any;

    state: any,
}

const SpeedTraceEmptyPanelBindings: ISpeedTraceEmptyPanelBindings = {
    // change operational event
    state: '<?iqsState',
}

class SpeedTraceEmptyPanelChanges implements ng.IOnChangesObject, ISpeedTraceEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

     state: ng.IChangesObject<string>;
}

class SpeedTraceEmptyPanelController implements ng.IController {          public $onInit() {}
    public onSpeedTraceAdd: () => void;
    public state: string;
    public accessConfig: any;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService
    ) {
        "ngInject";
        
        $element.addClass('iqs-speed-trace-empty-panel');
        this.accessConfig = iqsAccessConfig.getStateConfigure().access;
    }

    public onAdd(): void {
        if (this.onSpeedTraceAdd) {
            this.onSpeedTraceAdd();
        }
    }
}

(() => {
    angular
        .module('iqsSpeedTraceEmptyPanel', [])
        .component('iqsSpeedTraceEmptyPanel', {
            bindings: SpeedTraceEmptyPanelBindings,
            templateUrl: 'statistics/speed_trace/panels/SpeedTraceEmptyPanel.html',
            controller: SpeedTraceEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
