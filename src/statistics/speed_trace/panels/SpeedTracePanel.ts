import { ISpeedTraceSaveService } from '../ISpeedTraceSaveService';

interface ISpeedTracePanelBindings {
    [key: string]: any;

    item: any;
    ngDisabled: any;
}

const SpeedTracePanelBindings: ISpeedTracePanelBindings = {
    item: '<?iqsObject',
    ngDisabled: '&?'
}

class SpeedTracePanelChanges implements ng.IOnChangesObject, ISpeedTracePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<iqs.shell.ControlObject>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class SpeedTracePanelController implements ng.IController {          public $onInit() {}
    public item: iqs.shell.ControlObject;
    public filterParams: any;
    public ngDisabled: () => boolean;
    // view statistics table or graph
    public view: string;

    public startDate: string | Date;
    public endDate: string | Date;
    public dateType: string;
    public filterVisibility: iqs.shell.StatisticsFilterVisibility = {
        DatePeriod: true
    };
    public filterValues: any = {};
    public formatX: Function;
    public formatY: Function;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsSpeedTraceSaveService: ISpeedTraceSaveService,
        private iqsStatisticsDateService: iqs.shell.IStatisticsDateService,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        "ngInject";

        $element.addClass('iqs-speed-trace-panel');
        if(this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));

        this.restore();
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private restore(): void {
        if (this.$location.search()['view'] == iqs.shell.StatisticsView.Chart || this.$location.search()['view'] == iqs.shell.StatisticsView.Grid) {
            this.view = this.$location.search()['view'];
        } else {
            this.view = this.iqsSpeedTraceSaveService.view ? this.iqsSpeedTraceSaveService.view : iqs.shell.StatisticsView.Chart;
            this.$location.search('view', this.view);
            this.iqsSpeedTraceSaveService.view = this.view;
        }

        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();

        this.setFilterValues();

        // this.formatX = (x) => {
        //     return this.iqsStatisticsDateService.formatXTick(x, this.filterParams.datePeriod);
        // }

        // this.formatY = (y) => {
        //     return this.iqsStatisticsViewModel.formatDisplayData(y, this.filterParams.param);
        // }
    }

    public get points(): any {
        return []; //this.iqsObjectPositionsViewModel.points;
    }

    private createStatisticsRequest() {
        // слишком много данных скачивается

        // this.iqsObjectPositionsViewModel.setIdsAndDownload(
        //     [this.item.id], 
        //     new Date(this.startDate).toISOString(), 
        //     new Date(this.endDate).toISOString(), 
        //     true, true,
        // () => {
        //     console.log('this.points', this.points)

        //     // todo: create statistics 
        // });
    }

    private prepare() {
        if (!this.iqsLoading.isDone) return;
        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();
        this.createStatisticsRequest();
    }

    private setFilterValues() {
        this.filterValues = {
            paramsValue: this.$location.search()['param'],
        }
    }

    private setUrlParams(params) {
        this.$location.search('date', params.fromDate.toISOString());
        this.$location.search('type', params.datePeriod);
    }

    public $onChanges(changes: SpeedTracePanelChanges): void {
         this.prepare();
    }

    public changeView(newView) {
        if ( this.view == newView) {
            return;
        }

        if (newView != iqs.shell.StatisticsView.Chart || newView != iqs.shell.StatisticsView.Grid) {
            return;
        }

        this.view = newView;
        this.$location.search('view', this.view);
        this.iqsSpeedTraceSaveService.view = this.view;
    }

    public updateStatistics(params) {
        if (!this.iqsLoading.isDone) return;
        this.filterParams = params;
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[params.datePeriod];
        this.setUrlParams(params);

        this.prepare();
    }

    public get state() {
        return 'empty';//this.iqsObjectPositionsViewModel.state;
    }

    public get statistics() {
        return {}; //this._dataSpeedTrand;
    }
}

(() => {
    angular
        .module('iqsSpeedTracePanel', [])
        .component('iqsSpeedTracePanel', {
            bindings: SpeedTracePanelBindings,
            templateUrl: 'statistics/speed_trace/panels/SpeedTracePanel.html',
            controller: SpeedTracePanelController,
            controllerAs: '$ctrl'
        })
})();
