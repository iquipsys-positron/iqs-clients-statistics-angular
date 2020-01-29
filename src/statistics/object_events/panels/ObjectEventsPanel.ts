interface IStatisticsObjectEventsPanelBindings {
    [key: string]: any;

    item: any;
}

const StatisticsObjectEventsPanelBindings: IStatisticsObjectEventsPanelBindings = {
    item: '<?iqsObject',
}

class StatisticsObjectEventsPanelChanges implements ng.IOnChangesObject, IStatisticsObjectEventsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<any>;
}

class StatisticsObjectEventsPanelController implements IStatisticsObjectEventsPanelBindings {
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
    public statType: string = 'events';
    public gridType: string = iqs.shell.GridTypes.Formated;
    public statsDescription: string = null;
    public gridNameLabel: string;
    public gridValueLabel: string;
    private first: boolean = true;
    private cf: Function[] = [];

    constructor(
        private $state: ng.ui.IStateService,
        private $interval: ng.IIntervalService,
        private $rootScope: ng.IRootScopeService,
        private iqsStatisticsViewModel: iqs.shell.IStatisticsViewModel,
        private $location: ng.ILocationService,
        private iqsStatisticsDateService: iqs.shell.IStatisticsDateService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();
        this.setFilterValues();
        if (this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));

        this.formatX = (x) => {
            return this.iqsStatisticsDateService.formatXTick(x, this.filterParams.datePeriod);
        }

        this.formatY = (y) => {
            let fY = Number(y).toFixed();

            return fY === String(y) ? fY : '';
        }

        this.formatGridX = (item) => {
            if (!this.item.id || this.item.id == 'all') {
                return item.key;
            } else {
                return this.iqsStatisticsDateService.formatXGridTick(item.x, this.dateType);
            }
        }

        this.formatGridY = (item) => {
            if (angular.isObject(item)) {
                return item.value;
            } else {
                return item;
            }
        }
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public generateStatsDescription(secondArg: string, thirdArg: string, forthArg: string, each: boolean = false) {
        if (forthArg == 'all') this.statsDescription = 'STATS_EVENTS_ALL'; // Суммарное количество событий за выбранный промежуток времени
        else {
            if (this.filterParams.objectGroupId && each) this.statsDescription = 'STATS_EVENTS_GROUPED_BY_OBJECT'; // Количество произошедших событий во времени сгруппированные по объектам
            else this.statsDescription = this.statsDescription = 'STATS_EVENTS_SPECIFIC'; // Количество произошедших событий во времени
        }

        this.statsDescription = 'STATS_EVENTS_ALL';
        this.gridValueLabel = 'STATISTICS_EVENTS_VALUE';
        this.gridNameLabel = 'STATISTICS_EVENTS_TIME';
        this.gridType = iqs.shell.GridTypes.Formated;

        if (forthArg == 'all' && thirdArg == 'all' && secondArg == 'all') {
            this.gridNameLabel = 'STATISTICS_EVENTS_ZONES';

            return;
        }

        if (forthArg == 'all' && (thirdArg != 'all' || secondArg != 'all')) {
            this.gridNameLabel = 'STATISTICS_EVENTS_RULE_NAME';

            return;
        }
    }

    public updateStatistics(params) {
        if (this.first) {
            this.first = false;

            return;
        }
        if (!this.iqsLoading.isDone) return;
        this.filterParams = params;
        this.filterParams.ruleId = this.item.id;
        this.filterParams.ruleName = this.item.id;
        this.filterParams.paramName = this.item.name;
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[params.datePeriod];
        this.statisticsObject = params.object ? params.object : params.objectGroup;
        this.view = iqs.shell.StatisticsView.Chart;

        this.setUrlParams(params);
        this.createStatisticsRequest(params);
    }

    public get state() {
        return this.iqsStatisticsViewModel.state;
    }

    private setFilterValues() {
        this.filterValues = {
            zoneValue: this.$location.search()['zone_stat_id'] ? this.$location.search()['zone_stat_id'] : 'all',
            ruleValue: this.$location.search()['event_stat_id'] ? this.$location.search()['event_stat_id'] : 'all',
            objectValue: this.$location.search()['object_stat_id'] ? this.$location.search()['object_stat_id'] : 'all'
        }
    }

    private setUrlParams(params) {
        this.$location.search('object_stat_id', params.objectId || params.objectGroupId);
        this.$location.search('zone_stat_id', params.zoneId);
        this.$location.search('event_stat_id', this.item.id || 'all');
        if (params.fromDate) this.$location.search('date', params.fromDate.toISOString());
        if (params.toDate) this.$location.search('to_date', params.toDate.toISOString());
        this.$location.search('type', params.datePeriod);
    }

    private createStatisticsRequest(params = null, each = false) {
        if (!this.iqsLoading.isDone) return;
        let secondArg, thirdArg, forthArg, startDate, endDate, dateType;

        this.startDate = params && params.fromDate ? params.fromDate : this.iqsStatisticsDateService.getStartDate();
        this.endDate = params && params.toDate ? params.toDate : this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();

        each = this.view === iqs.shell.StatisticsView.List;

        if (params !== null) {
            secondArg = params.objectId || params.objectGroupId || 'all';
            thirdArg = params.zoneId || 'all';
            forthArg = this.item.id || 'all';
        } else {
            secondArg = this.$location.search()['object_stat_id'] ? this.$location.search()['object_stat_id'] : 'all';
            thirdArg = this.$location.search()['zone_stat_id'] ? this.$location.search()['zone_stat_id'] : 'all';
            forthArg = this.$location.search()['event_stat_id'] ? this.$location.search()['event_stat_id'] : this.item.id || 'all';
        }

        this.iqsStatisticsViewModel.getStatistics(this.statType, secondArg, thirdArg, forthArg, this.startDate, this.endDate, this.dateType, each);
        this.generateStatsDescription(secondArg, thirdArg, forthArg, each);
    }

    public $onChanges(changes: StatisticsObjectEventsPanelChanges): void {
        this.prepare();
    }

    private prepare() {
        if (!this.iqsLoading.isDone) return;
        this.filterParams.ruleId = this.item.id;
        this.filterParams.ruleName = this.item.id;
        this.filterParams.paramName = this.item.name;
        this.setUrlParams(this.filterParams);
        this.createStatisticsRequest(this.filterParams);
    }

    public changeView(view: string) {
        if (view === 'list' && (this.view === 'chart' || this.view === 'grid')) {
            this.createStatisticsRequest(this.filterParams, true);
        }

        if (this.view === 'list' && (view === 'chart' || view === 'grid')) {
            this.createStatisticsRequest(this.filterParams, false);
        }

        this.view = view;
    }

    public get statistics() {
        return this.iqsStatisticsViewModel.statistics;
    }
}

(() => {
    angular
        .module('iqsObjectEventsPanel', ['iqsStatistics'])
        .component('iqsObjectEventsPanel', {
            bindings: StatisticsObjectEventsPanelBindings,
            templateUrl: 'statistics/object_events/panels/ObjectEventsPanel.html',
            controller: StatisticsObjectEventsPanelController,
            controllerAs: '$ctrl'
        })
})();
