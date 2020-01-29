import { IDistanceSaveService } from '../IDistanceSaveService';

class DetailsParams {
    public item: any;
}

interface IDistancePanelBindings {
    [key: string]: any;

    item: any;
    onDetails: any;
}

const DistancePanelBindings: IDistancePanelBindings = {
    item: '<?iqsObject',
    onDetails: '&iqsOpenDetails'
}

class DistancePanelChanges implements ng.IOnChangesObject, IDistancePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<any>;
    onDetails: ng.IChangesObject<() => ng.IPromise<void>>;
}

class DistancePanelController implements IDistancePanelBindings {
    public item: any;
    public startDate: Date | string;
    public endDate: Date | string;
    public dateType: string;
    public filterVisibility: any = {
        ZoneFilter: true,
        DatePeriod: true
    };
    public filterValues: any = {};
    public filterParams: any = {};
    public formatX: Function;
    public formatY: Function;
    public formatGridX: Function;
    public formatGridY: Function;
    public view: string = 'chart';
    public statType: string = 'distance';
    public statsDescription: string = null;
    public statsDescriptionDetails: string = null;
    public onDetails: (param: DetailsParams) => void;
    private first: boolean = true;
    public gridType: string = iqs.shell.GridTypes.Group;

    public gridNameLabel: string;
    public gridValueLabel: string;
    public zoneCollection: iqs.shell.StatisticsDataCollectionItem[];
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
        private iqsDistanceSaveService: IDistanceSaveService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsStatisticsCollectionsService: iqs.shell.IStatisticsCollectionsService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-distance-panel');
        this.restore();
        if (this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));

        this.formatX = (x) => {
            return this.iqsStatisticsDateService.formatXTick(x, this.dateType);
        }

        this.formatY = (y) => {
            return this.iqsStatisticsViewModel.formatDisplayData(y, this.statType);
        }

        this.formatGridX = (item) => {
            switch (this.gridType) {
                case iqs.shell.GridTypes.Group:
                    return item.key;
                default:
                    if (this.filterParams.zoneId || this.filterParams.objectId || this.filterParams.objectGroupId) {
                        return this.iqsStatisticsDateService.formatXGridTick(item.x, this.dateType);
                    } else {
                        return item.key;
                    }

            }
        }

        this.formatGridY = (item) => {
            switch (this.gridType) {
                case iqs.shell.GridTypes.Group:
                    return item.display;
                default:
                    if (angular.isObject(item)) {
                        return this.iqsStatisticsViewModel.formatDisplayData(item.value, this.statType);
                    } else {
                        return this.iqsStatisticsViewModel.formatDisplayData(item, this.statType);
                    }


            }
        }
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private restore(): void {
        if (this.$location.search()['view'] == iqs.shell.StatisticsView.Chart || this.$location.search()['view'] == iqs.shell.StatisticsView.Grid) {
            this.view = this.$location.search()['view'];
        } else {
            this.view = this.iqsDistanceSaveService.view ? this.iqsDistanceSaveService.view : iqs.shell.StatisticsView.Chart;
            this.$location.search('view', this.view);
            this.iqsDistanceSaveService.view = this.view;
        }

        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[this.dateType];

        let zoneId;
        if (!this.$location.search()['zone_stat_id'] && this.iqsDistanceSaveService.filterParams && this.iqsDistanceSaveService.filterParams.zoneId) {
            zoneId = this.iqsDistanceSaveService.filterParams.zoneId;
        } else {
            zoneId = this.$location.search()['zone_stat_id'] ? this.$location.search()['zone_stat_id'] : null;
            this.filterParams.zoneId = zoneId;
        }
        this.$location.search('zone_stat_id', zoneId);

        this.setFilterValues();
    }

    public generateStatsDescription(secondArg: string, thirdArg: string, each: boolean = false) {
        // this.statsDescription = 'STATS_DISTANCE_ALL';
        this.gridValueLabel = 'STATISTICS_DISTANCE_VALUE';
        this.gridNameLabel = 'STATISTICS_DISTANCE_TIME';

        if (!this.filterParams.objectId && !this.filterParams.objectGroupId) {
            this.statsDescription = 'STATS_DISTANCE_ALL_OBJECTS';
            this.statsDescriptionDetails = null;
        } else if (this.filterParams.objectGroupId) {
            this.statsDescription = 'STATS_DISTANCE_GROUP_OBJECTS';
            let group = this.iqsObjectGroupsViewModel.getGroupById(this.filterParams.objectGroupId);
            this.statsDescriptionDetails = group ? group.name : '';;
        } else if (this.filterParams.objectId) {
            this.statsDescription = 'STATS_DISTANCE_OBJECT';
            let object = this.iqsObjectsViewModel.getObjectById(this.filterParams.objectId)
            this.statsDescriptionDetails = object ? object.name : '';;
        }

        if (secondArg == 'all' && thirdArg == 'all') {
            // this.statsDescription = 'STATS_DISTANCE_ALL';
            this.gridNameLabel = 'STATISTICS_DISTANCE_ZONES';
            // this.gridNameLabel = 'STATISTICS_DISTANCE_OBJECT_AND_GROUPS';
            this.gridType = iqs.shell.GridTypes.Formated;
            return;
        }
        if (secondArg != 'all' && thirdArg == 'all' && !each) {
            // this.statsDescription = 'STATS_DISTANCE_BY_OBJECT_EACH_ZONE';
            // this.gridNameLabel = 'STATISTICS_DISTANCE_ZONES';
            this.gridType = iqs.shell.GridTypes.Formated;
            return;
        }
        if (secondArg != 'all' && thirdArg == 'all' && each) {
            // this.statsDescription = 'STATS_DISTANCE_EACH_OBJECT_OF_GROUP';
            // this.gridNameLabel = 'STATISTICS_DISTANCE_OBJECT_OF_GROUPS';
            this.gridType = iqs.shell.GridTypes.Group;
            return;
        }
        if (secondArg == 'all' && thirdArg != 'all') {
            // this.statsDescription = 'STATS_DISTANCE_EACH_OBJECT_ZONE';
            // this.gridNameLabel = 'STATISTICS_DISTANCE_OBJECT_AND_GROUPS';
            this.gridType = iqs.shell.GridTypes.Formated;
            return;
        }
        if (secondArg != 'all' && thirdArg != 'all' && !each) {
            // this.statsDescription = 'STATS_DISTANCE_BY_OBJECT_BY_ZONE';
            this.gridType = iqs.shell.GridTypes.Formated;
            return;
        }
        if (secondArg != 'all' && thirdArg != 'all' && each) {
            // this.statsDescription = 'STATS_DISTANCE_EACH_OBJECT_OF_GROUP_BY_ZONE';
            // this.gridNameLabel = 'STATISTICS_DISTANCE_OBJECT_OF_GROUPS';
            this.gridType = iqs.shell.GridTypes.Group;
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
        this.dateType = params.datePeriod;
        this.setDefaultFilterParams();
        this.setUrlParams(this.filterParams);
        this.createStatisticsRequest(this.filterParams);
    }

    public get state() {
        return this.iqsStatisticsViewModel.state;
    }

    private setFilterValues() {
        this.filterValues = {
            zoneValue: this.$location.search()['zone_stat_id']
        }
    }

    private setUrlParams(params) {
        this.$location.search('zone_stat_id', params.zoneId);
        this.$location.search('object_stat_id', params.objectId || params.objectGroupId);
        if (params.fromDate) this.$location.search('date', params.fromDate.toISOString());
        if (params.toDate) this.$location.search('to_date', params.toDate.toISOString());
        this.$location.search('type', this.dateType);
        this.iqsDistanceSaveService.filterParams = params;
    }

    private setIsGroup(): boolean {
        if (this.item.id == 'all' || !this.item.id) {
            return true;
        }
        if (this.item.object_type == iqs.shell.SearchObjectTypes.ObjectGroup) {
            return true;
        }

        // if (this.filterParams.zoneId == 'all' || !this.filterParams.zoneId) {
        //     return true;
        // }

        return false;
    }

    private setViews(): void {
        if (!this.isGroup && this.view == iqs.shell.StatisticsView.List) {
            this.view = 'chart';
            this.changeView('chart');
        } else if (this.isGroup) {
            this.view = iqs.shell.StatisticsView.List;
        }
    }

    private createStatisticsRequest(params = null, each = false) {
        if (!this.iqsLoading.isDone) return;
        let secondArg, thirdArg, startDate, endDate, dateType;
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
        this.iqsStatisticsViewModel.getStatistics(this.statType, secondArg, thirdArg, this.statType, this.startDate, this.endDate, this.dateType, each);
        this.generateStatsDescription(secondArg, thirdArg, each);
    }

    public onOpenDetails(item: any): void {
        if (this.view == iqs.shell.StatisticsView.List) {
            if (this.item.id == 'all' || this.filterParams.objectGroupId) {
                // choose object
                if (this.onDetails) {
                    this.onDetails({ item: item });
                }
            } else {
                // choose zone
                let index: number = _.findIndex(this.zoneCollection, (zone: any) => {
                    return zone.name == item.key;
                });

                if (index != -1) {
                    this.$location.search('zone_stat_id', this.zoneCollection[index].id);
                    this.filterValues = {
                        zoneValue: this.zoneCollection[index].id
                    }
                }
            }
        } else {
            let index: number = _.findIndex(this.zoneCollection, (zone: any) => {
                return zone.name == item.key;
            });

            if (index != -1) {
                this.$location.search('zone_stat_id', this.zoneCollection[index].id);
                this.filterValues = {
                    zoneValue: this.zoneCollection[index].id
                }
            }
        }

    }

    private setDefaultFilterParams(): void {
        this.zoneCollection = this.iqsStatisticsCollectionsService.getZoneCollection();
        this.filterParams.param = this.statType;

        if (this.item.id == 'all' || !this.item.id) {
            this.filterParams.objectId = null;
            this.filterParams.objectGroupId = null;
        } else if (this.item.object_type == iqs.shell.SearchObjectTypes.ControlObject) {
            this.filterParams.objectId = this.item.id;
            this.filterParams.objectGroupId = null;
        } else {
            this.filterParams.objectId = null;
            this.filterParams.objectGroupId = this.item.id;
        }
        this.dateType = this.dateType ? this.dateType : this.iqsStatisticsDateService.getDateType();
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[this.dateType];
    }

    public $onChanges(changes: DistancePanelChanges): void {
        this.prepare();
    }

    private prepare() {
        if (!this.iqsLoading.isDone) return;
        this.setDefaultFilterParams();
        this.setUrlParams(this.filterParams);
        this.isGroup = this.setIsGroup();
        this.setViews();
        this.createStatisticsRequest(this.filterParams);
    }

    public changeView(view) {
        let isRequest: boolean = this.view != view && (this.view == iqs.shell.StatisticsView.List || view == iqs.shell.StatisticsView.List)
        this.view = view;
        this.$location.search('view', this.view);
        this.iqsDistanceSaveService.view = this.view;
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
        .module('iqsDistancePanel', [
            'iqsStatistics',
            'iqsObjectGroups.ViewModel',
            'iqsObjects.ViewModel',
        ])
        .component('iqsDistancePanel', {
            bindings: DistancePanelBindings,
            templateUrl: 'statistics/distance/panels/DistancePanel.html',
            controller: DistancePanelController,
            controllerAs: '$ctrl'
        })
})();
