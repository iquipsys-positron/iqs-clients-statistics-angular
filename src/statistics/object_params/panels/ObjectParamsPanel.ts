interface IStatisticsObjectParamsPanelBindings {
    [key: string]: any;

    item: any;
}

const StatisticsObjectParamsPanelBindings: IStatisticsObjectParamsPanelBindings = {
    item: '<?iqsObject'
}

class StatisticsObjectParamsPanelChanges implements ng.IOnChangesObject, IStatisticsObjectParamsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<any>;
}

class StatisticsObjectParamsPanelController implements IStatisticsObjectParamsPanelBindings {
    public item: any;
    public startDate: Date | string;
    public endDate: Date | string;
    public dateType: string;
    public filterVisibility: iqs.shell.StatisticsFilterVisibility = {
        ObjectFilter: true,
        ZoneFilter: true,
        DatePeriod: true
    };
    public filterValues: any = {};
    public filterParams: any = {};
    public formatX: Function;
    public formatY: Function;
    public formatGridX: Function;
    public formatGridY: Function;
    public statisticsObject: any;
    public view: string = 'chart';
    public statType: string = 'params';
    public statsDescription: string = null;
    public gridNameLabel: string;
    public gridValueLabel: string;
    public gridType: string = iqs.shell.GridTypes.Formated;
    private cf: Function[] = [];

    constructor(
        private $state: ng.ui.IStateService,
        private $interval: ng.IIntervalService,
        private $rootScope: ng.IRootScopeService,
        private iqsStatisticsViewModel: iqs.shell.IStatisticsViewModel,
        private pipMedia: pip.layouts.IMediaService,
        private $location: ng.ILocationService,
        private iqsStatisticsDateService: iqs.shell.IStatisticsDateService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        const runWhenReady = () => {
            this.setFilterValues();
            if (this.$location.search()['details'] == 'false' && !this.pipMedia('gt-sm')) return;
            this.createStatisticsRequest();
        };
        if(this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));

        if (this.$location.search()['details'] == 'false' && !this.pipMedia('gt-sm')) return;

        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();

        this.formatX = (x) => {
            return this.iqsStatisticsDateService.formatXTick(x, this.filterParams.datePeriod);
        }

        this.formatY = (y) => {
            return this.iqsStatisticsViewModel.formatDisplayData(y, this.filterParams.param);
        }

        this.formatGridX = (item) => {
            if (!this.item.id || this.item.id == 'all') {
                return item.key;
            } else {
                return this.iqsStatisticsDateService.formatXGridTick(item.x, this.dateType);
            }
        }

        this.formatGridY = (item) => {
            return this.iqsStatisticsViewModel.formatDisplayData(angular.isObject(item) ? item.value : item, this.item.id);
        }
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public generateStatsDescription(secondArg: string, thirdArg: string, forthArg: string, each: boolean = false) {
        if (forthArg == 'all') this.statsDescription = 'STATISTICS_BY_ALL_PARAMS';
        else {
            if (forthArg === 'speed') this.statsDescription = 'STATS_PARAMS_SPEED'; // Средняя скорость расчитывается на основе пройденного расстояния и может не учитывать мгновенные ускорения объекта
            else this.statsDescription = this.statsDescription = 'STATS_PARAMS_SPECIFIC'; // Количество произошедших событий во времени
        }
        this.gridNameLabel = 'STATISTICS_OBJECT_PARAMS_TIME'
        switch (forthArg) {
            case 'distance':
                this.gridType = iqs.shell.GridTypes.Formated;
                this.gridValueLabel = 'STATS_DISTANCE_SHORT';
                break;
            case 'speed':
                this.gridType = iqs.shell.GridTypes.Formated;
                this.gridValueLabel = 'STATISTICS_OBJECT_PARAMS_AVG_SPEED'
                break;
            default:
                this.gridType = iqs.shell.GridTypes.Time;
                this.gridValueLabel = 'STATISTICS_OBJECT_PARAMS_TIME';
                break;
        }

    }

    public updateStatistics(params) {
        if (!this.iqsLoading.isDone) return;
        this.filterParams = params;
        this.filterParams.param = this.item.id;
        this.filterParams.paramName = this.item.name;
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[params.datePeriod];
        this.statisticsObject = params.object ? params.object : params.objectGroup;
        this.view = 'chart';
        this.setUrlParams(params);
        this.createStatisticsRequest(params);
    }

    public get state() {
        return this.iqsStatisticsViewModel.state;
    }

    private setFilterValues() {
        this.filterValues = {
            zoneValue: this.$location.search()['zone_stat_id'],
            paramsValue: this.$location.search()['param'],
            objectValue: this.$location.search()['object_stat_id']
        }
    }

    private setUrlParams(params) {
        this.$location.search('object_stat_id', params.objectId || params.objectGroupId);
        this.$location.search('object_stat_id', params.zoneId);
        this.$location.search('param', this.item.id || 'all');
        if (params.fromDate) this.$location.search('date', params.fromDate.toISOString());
        if (params.toDate) this.$location.search('to_date', params.toDate.toISOString());
        this.$location.search('type', params.datePeriod);
    }

    private createStatisticsRequest(params = null, each = false) {
        if (!this.iqsLoading.isDone) return;
        let secondArg, thirdArg, forthArg, startDate, endDate, dateType;

        this.startDate = params && params.fromDate ? params.fromDate : this.iqsStatisticsDateService.getStartDate();
        this.endDate = params && params.toDate ? params.toDate : this.iqsStatisticsDateService.getEndDate();
        // this.startDate = this.iqsStatisticsDateService.getStartDate();
        // this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();

        if (params !== null) {
            secondArg = params.objectId || params.objectGroupId || 'all';
            thirdArg = params.zoneId || 'all';
            forthArg = this.item.id || 'all';
        } else {
            secondArg = this.$location.search()['object_stat_id'] ? this.$location.search()['object_stat_id'] : 'all';
            thirdArg = this.$location.search()['zone_stat_id'] ? this.$location.search()['zone_stat_id'] : 'all';
            forthArg = this.$location.search()['param'] ? this.$location.search()['param'] : this.item.id || 'all';
        }

        this.iqsStatisticsViewModel.getStatistics(this.statType, secondArg, thirdArg, forthArg, this.startDate, this.endDate, this.dateType, each);
        this.generateStatsDescription(secondArg, thirdArg, forthArg, each);
    }

    public $onChanges(changes: StatisticsObjectParamsPanelChanges): void {
        this.prepare();
    }

    private prepare() {
        if (!this.iqsLoading.isDone) return;
        this.filterParams.param = this.item.id;
        this.filterParams.paramName = this.item.name;
        this.setUrlParams(this.filterParams);
        this.createStatisticsRequest(this.filterParams);
    }

    public changeView(newView, prevView) {
        if (newView === 'list' && (prevView === 'chart' || prevView === 'grid')) {
            this.createStatisticsRequest(null, true);
        }

        if (prevView === 'list' && (newView === 'chart' || newView === 'grid')) {
            this.createStatisticsRequest(null, false);
        }

        this.view = newView;
    }

    public get statistics() {
        return this.iqsStatisticsViewModel.statistics;
    }
}

(() => {
    angular
        .module('iqsObjectParamsPanel', [
            'iqsStatistics',
            'iqsStatistics.DateService'
        ])
        .component('iqsObjectParamsPanel', {
            bindings: StatisticsObjectParamsPanelBindings,
            templateUrl: 'statistics/object_params/panels/ObjectParamsPanel.html',
            controller: StatisticsObjectParamsPanelController,
            controllerAs: '$ctrl'
        })
})();
