import { IPresenceSaveService } from '../IPresenceSaveService';

class DetailsParams {
    public item: any;
}

interface IPresencePanelBindings {
    [key: string]: any;

    item: any;
    onDetails: any;
}

const PresencePanelBindings: IPresencePanelBindings = {
    item: '<?iqsObject',
    onDetails: '&iqsOpenDetails'
}

class PresencePanelChanges implements ng.IOnChangesObject, IPresencePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<any>;
    onDetails: ng.IChangesObject<() => ng.IPromise<void>>;
}

class PresencePanelController implements IPresencePanelBindings {
    public item: any;
    public startDate: Date | string;
    public endDate: Date | string;
    public dateType: string;
    public filterVisibility: iqs.shell.StatisticsFilterVisibility = {
        ObjectFilter: true,
        DatePeriod: true
    };
    public filterValues: any = {};
    public filterParams: any = {};
    public formatX: Function;
    public formatY: Function;
    public formatGridX: Function;
    public formatGridY: Function;
    public view: string = 'chart';
    public statType: string = 'presence';
    public statsDescription: string = null;
    public statsDescriptionDetails: string = null;
    public onDetails: (param: DetailsParams) => void;
    private first: boolean = true;
    public gridType: string = iqs.shell.GridTypes.Group;

    public gridNameLabel: string;
    public gridValueLabel: string;
    public objectGroupCollection: iqs.shell.StatisticsDataCollectionItem[];
    public isGroup: boolean = false;
    private cf: Function[] = [];

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $interval: ng.IIntervalService,
        private $rootScope: ng.IRootScopeService,
        private iqsStatisticsViewModel: iqs.shell.IStatisticsViewModel,
        private $location: ng.ILocationService,
        private iqsStatisticsDateService: iqs.shell.IStatisticsDateService,
        private iqsPresenceSaveService: IPresenceSaveService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsZonesViewModel: iqs.shell.IZonesViewModel,
        private iqsStatisticsCollectionsService: iqs.shell.IStatisticsCollectionsService,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        "ngInject";

        $element.addClass('iqs-presence-panel');
        if(this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));
        this.restore();

        this.formatX = (x) => {
            return this.iqsStatisticsDateService.formatXTick(x, this.dateType);
        }

        this.formatY = (y) => {
            return this.iqsStatisticsViewModel.formatDisplayData(y, 'online');
        }

        this.formatGridX = (item) => {
            switch (this.gridType) {
                default:
                    if (this.filterParams.zoneId || this.filterParams.objectId || this.filterParams.objectGroupId) {
                        return this.iqsStatisticsDateService.formatXGridTick(item.x, this.dateType);
                    } else {
                        if (item.key || item.label) return item.key || item.label
                        else return this.iqsStatisticsDateService.formatXGridTick(item.x, this.dateType);
                    }
            }
        }

        this.formatGridY = (item) => {
            switch (this.gridType) {
                default:
                    if (angular.isObject(item)) {
                        return this.iqsStatisticsViewModel.formatDisplayData(item.value, 'online');
                    } else {
                        return this.iqsStatisticsViewModel.formatDisplayData(item, 'online');
                    }
            }
        }
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private restore(): void {
        this.objectGroupCollection = this.iqsStatisticsCollectionsService.getObjectAndGroupCollection();
        if (this.$location.search()['view'] == iqs.shell.StatisticsView.Chart || this.$location.search()['view'] == iqs.shell.StatisticsView.Grid) {
            this.view = this.$location.search()['view'];
        } else {
            this.view = this.iqsPresenceSaveService.view ? this.iqsPresenceSaveService.view : iqs.shell.StatisticsView.Chart;
            this.$location.search('view', this.view);
            this.iqsPresenceSaveService.view = this.view;
        }

        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[this.dateType];
        let objectId = this.iqsPresenceSaveService.filterParams ? this.iqsPresenceSaveService.filterParams.objectId || this.iqsPresenceSaveService.filterParams.objectGroupId : null;
        if (this.$location.search()['object_stat_id']) {
            objectId = objectId = this.$location.search()['object_stat_id'];
        }

        this.$location.search('object_stat_id', objectId);
        this.setObjectFilter();

        this.setFilterValues();
    }

    public generateStatsDescription(secondArg: string, thirdArg: string, each: boolean = false) {
        if (this.filterParams.zoneId) {
            let zone = this.iqsZonesViewModel.getZoneById(this.filterParams.zoneId)
            this.statsDescription = 'STATS_PRESENCE_IN_ZONE';
            this.statsDescriptionDetails = zone ? zone.name : '';
        } else {
            this.statsDescription = 'STATS_PRESENCE_ALL_ZONE';
            this.statsDescriptionDetails = '';
        }


        this.gridValueLabel = 'STATISTICS_PRESENCE_VALUE';
        this.gridType = iqs.shell.GridTypes.Time;

        if (secondArg == 'all' && thirdArg == 'all') {
            this.gridNameLabel = 'STATISTICS_PRESENCE_ZONES';
        } else {
            this.gridNameLabel = 'STATISTICS_PRESENCE_TIME';
        }
    }

    public updateStatistics(params) {
        if (this.first) {
            this.first = false;

            return;
        }
        if (!this.iqsLoading.isDone) return;
        this.filterParams = params;
        this.dateType = params.datePeriod;
        this.filterParams.param = 'online';
        this.setDefaultFilterParams();
        this.setUrlParams(this.filterParams);
        this.setObjectFilter();
        this.isGroup = this.setIsGroup();
        this.setViews();   
        this.createStatisticsRequest(this.filterParams);
    }

    public get state() {
        return this.iqsStatisticsViewModel.state;
    }

    private setFilterValues() {
        this.filterValues = {
            objectValue: this.$location.search()['object_stat_id']
        }
    }

    private setObjectFilter() {
        let id = this.$location.search()['object_stat_id'];
        if (!id) {
            this.filterParams.objectId = null;
            this.filterParams.objectGroupId = null;

            return;
        }
        let index: number = _.findIndex(this.objectGroupCollection, (obj: any) => {
            return obj.id == id;
        });
        this.filterParams.objectId = null;
        this.filterParams.objectGroupId = null;
        if (index != -1) {
            if (this.objectGroupCollection[index].object_type == iqs.shell.SearchObjectTypes.ControlObject) {
                this.filterParams.objectId = this.objectGroupCollection[index].id;
            }
            if (this.objectGroupCollection[index].object_type == iqs.shell.SearchObjectTypes.ObjectGroup) {
                this.filterParams.objectGroupId = this.objectGroupCollection[index].id;
            }
        }
    }

    private setIsGroup(): boolean {
        if (!this.filterParams.objectGroupId && !this.filterParams.zoneId && !this.filterParams.objectId) {
            return false;
        }

        if (!this.filterParams.zoneId) {
            return true;
        }

        if (this.filterParams.objectGroupId || !this.filterParams.objectGroupId && !this.filterParams.objectId) {
            return true;
        }

        return false;
    }

    private setViews(): void {
        if (!this.isGroup && this.view == iqs.shell.StatisticsView.List) {
            this.view = 'chart';
            this.changeView('chart');
        } else if (this.isGroup) {
            this.view =  iqs.shell.StatisticsView.List;
        }
    }
    
    private setUrlParams(params) {
        this.$location.search('zone_stat_id', params.zoneId);
        this.$location.search('object_stat_id', params.objectId || params.objectGroupId);
        if (params.fromDate) this.$location.search('date', params.fromDate.toISOString());
        if (params.toDate) this.$location.search('to_date', params.toDate.toISOString());
        this.$location.search('type', this.dateType);

        this.iqsPresenceSaveService.filterParams = params;
    }

    private createStatisticsRequest(params = null, each = false) {
        if (!this.iqsLoading.isDone) return;
        let secondArg, thirdArg, startDate, endDate, dateType;
        // this.startDate = this.iqsStatisticsDateService.getStartDate();
        // this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.startDate = params && params.fromDate || this.iqsStatisticsDateService.getStartDate();
        this.endDate = params && params.toDate || this.iqsStatisticsDateService.getEndDate();        
        this.dateType = !this.dateType ? this.iqsStatisticsDateService.getDateType() : this.dateType;

        each = this.view == iqs.shell.StatisticsView.List && this.isGroup;

        if (params !== null) {
            secondArg = params.objectId || params.objectGroupId ? params.objectId || params.objectGroupId : 'all';
            thirdArg = params.zoneId || 'all';
        } else {
            secondArg = this.$location.search()['object_stat_id'] ? this.$location.search()['object_stat_id'] : 'all';
            thirdArg = this.$location.search()['zone_stat_id'] ? this.$location.search()['zone_stat_id'] : this.item.id || 'all';
        }

        this.iqsStatisticsViewModel.getStatistics(this.statType, secondArg, thirdArg, 'all', this.startDate, this.endDate, this.dateType, each);
        this.generateStatsDescription(secondArg, thirdArg, each);
    }

    public onOpenDetails(item: any): void {
        if (this.view == iqs.shell.StatisticsView.List) {
            if (this.item.id == 'all') {
                // choose zone
                if (this.onDetails) {
                    this.onDetails({ item: item });
                }
            } else {
                // choose object
                if (!this.filterParams.objectId && !this.filterParams.objectGroupId || this.filterParams.objectGroupId) {
                    let index: number = _.findIndex(this.objectGroupCollection, (obj: any) => {
                        return obj.name == item.key;
                    });

                    if (index != -1) {
                        this.$location.search('object_stat_id', this.objectGroupCollection[index].id);
                        this.filterValues = {
                            objectValue: this.objectGroupCollection[index].id
                        }
                    }
                }
            }
        } else {
            if (this.item.id == 'all') {
                // choose zone
                if (this.onDetails) {
                    this.onDetails({ item: item });
                }
            }
        }
    }

    private setDefaultFilterParams(): void {
        this.objectGroupCollection = this.iqsStatisticsCollectionsService.getObjectAndGroupCollection();
        this.filterParams.param = 'online';
        if (this.item.id == 'all') {
            this.filterParams.zoneId = null;
        } else {
            this.filterParams.zoneId = this.item.id;
        }
        this.dateType = this.dateType ? this.dateType : this.iqsStatisticsDateService.getDateType();
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[this.dateType];
    }

    public $onChanges(changes: PresencePanelChanges): void {
        this.prepare();
    }

    private prepare() {
        if (!this.iqsLoading.isDone) return;
        this.setDefaultFilterParams();
        this.setUrlParams(this.filterParams);
        this.setObjectFilter();
        this.isGroup = this.setIsGroup();
        this.setViews();   
        this.createStatisticsRequest(this.filterParams);
    }

    public changeView(view) {
        let isRequest: boolean = this.view != view && (this.view == iqs.shell.StatisticsView.List || view == iqs.shell.StatisticsView.List)
        this.view = view;
        this.$location.search('view', this.view);
        this.iqsPresenceSaveService.view = this.view;
        if (isRequest) {
            this.createStatisticsRequest(this.filterParams);
        }
    }

    public get statistics() {
        return this.iqsStatisticsViewModel.statistics;
    }
}

(() => {
    angular
        .module('iqsPresencePanel', [
            'iqsHorizontalBars',
            'iqsStatistics',
            'iqsZones.ViewModel',
        ])
        .component('iqsPresencePanel', {
            bindings: PresencePanelBindings,
            templateUrl: 'statistics/presence/panels/PresencePanel.html',
            controller: PresencePanelController,
            controllerAs: '$ctrl'
        })
})();
