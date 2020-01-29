import { cloneDeep } from 'lodash';

import { IUsageSaveService } from '../IUsageSaveService';

class DetailsParams {
    public item: any;
}

interface IUsagePanelBindings {
    [key: string]: any;

    item: any;
    onDetails: any;
}

const UsagePanelBindings: IUsagePanelBindings = {
    item: '<?iqsObject',
    onDetails: '&iqsOpenDetails'
}

class UsagePanelChanges implements ng.IOnChangesObject, IUsagePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<any>;
    onDetails: ng.IChangesObject<() => ng.IPromise<void>>;
}

class UsagePanelController implements IUsagePanelBindings {
    public item: any;
    public startDate: Date | string;
    public endDate: Date | string;
    public dateType: string;
    public filterVisibility: iqs.shell.StatisticsFilterVisibility = {
        DatePeriod: true
    };
    public filterValues: any = {};
    public filterParams: any = {};
    public isInteractive: boolean = true;
    public formatX: Function;
    public formatY: Function;
    public formatGridX: Function;
    public formatGridY: Function;
    public view: string = iqs.shell.StatisticsView.List;
    public statType: string = 'states';
    public statsDescription: string = null;
    public statsDescriptionDetails: string = null;
    public onDetails: (param: DetailsParams) => void;
    private first: boolean = true;
    private rangeWithDate: boolean;

    public gridNameLabel: string = 'STATISTICS_USAGE';
    public gridValueLabels: string[] = [];
    public isGroup: boolean = false;
    private cf: Function[] = [];
    private latestGroupView: string = iqs.shell.StatisticsView.List;
    public barStatistics: any;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $interval: ng.IIntervalService,
        private $rootScope: ng.IRootScopeService,
        private iqsStatisticsViewModel: iqs.shell.IStatisticsViewModel,
        private $location: ng.ILocationService,
        private iqsStatisticsDateService: iqs.shell.IStatisticsDateService,
        private iqsUsageSaveService: IUsageSaveService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsStatisticsCollectionsService: iqs.shell.IStatisticsCollectionsService,
        private iqsDevicesViewModel: iqs.shell.IDevicesViewModel,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-usage-panel');
        this.restore();
        if (this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));

        this.formatX = (x) => {
            return this.iqsStatisticsDateService.formatXTick(x, this.dateType);
        }

        this.formatGridX = (val) => {
            switch (this.dateType) {
                case iqs.shell.StatisticsDateType.range: {
                    return moment(Number(val.x)).format(this.rangeWithDate ? 'YYYY-MM-DD HH:mm' : 'LT');
                }
                default: {
                    return val.x ? this.iqsStatisticsDateService.formatXGridTick(Number(val.x), this.dateType) : val;
                }
            }
        }
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private restore(): void {
        const view = this.$location.search()['view'];
        if ([iqs.shell.StatisticsView.List, iqs.shell.StatisticsView.Chart, iqs.shell.StatisticsView.Grid].includes(view)) {
            this.view = view;
        } else {
            this.view = this.iqsUsageSaveService.view ? this.iqsUsageSaveService.view : iqs.shell.StatisticsView.List;
            this.$location.search('view', this.view);
            this.iqsUsageSaveService.view = this.view;
        }

        this.startDate = this.iqsStatisticsDateService.getStartDate();
        this.endDate = this.iqsStatisticsDateService.getEndDate();
        this.dateType = this.iqsStatisticsDateService.getDateType();
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[this.dateType];
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

    private setUrlParams(params) {
        this.$location.search('device_stat_id', params.deviceId || params.objectGroupId);
        if (params.fromDate) this.$location.search('date', params.fromDate.toISOString());
        if (params.toDate) this.$location.search('to_date', params.toDate.toISOString());
        this.$location.search('type', this.dateType);
        this.iqsUsageSaveService.filterParams = params;
    }

    private setIsGroup(): boolean {
        return this.item.id == 'all' || !this.item.id || this.item.object_type == iqs.shell.SearchObjectTypes.ObjectGroup;
    }

    public generateStatsDescription() {
        this.gridNameLabel = 'STATISTICS_USAGE';

        if (this.filterParams.deviceId) {
            this.statsDescription = 'STATISTICS_USAGE_DEVICE';
            const device: iqs.shell.Device = this.iqsDevicesViewModel.getDeviceById(this.filterParams.deviceId);
            this.statsDescriptionDetails = device && device.label || device.udi;        
        } else if (this.filterParams.objectGroupId) {
            this.statsDescription = 'STATISTICS_USAGE_GROUP';
            const group: iqs.shell.ObjectGroup = this.iqsObjectGroupsViewModel.getGroupById(this.filterParams.objectGroupId);
            this.statsDescriptionDetails = group ? group.name : null;
        } else {
            this.statsDescription = 'STATISTICS_USAGE_ALL';
            this.statsDescriptionDetails = null;
        }
        this.gridValueLabels = [];
        for (const s of this.statistics['series']) {
            this.gridValueLabels.push(s.key);
        }
        this.gridValueLabels.sort();
    }

    private createStatisticsRequest(params = null, each = false) {
        if (!this.iqsLoading.isDone) return;
        let secondArg, thirdArg, startDate, endDate, dateType;
        this.startDate = params && params.fromDate || this.iqsStatisticsDateService.getStartDate();
        this.endDate = params && params.toDate || this.iqsStatisticsDateService.getEndDate();
        this.dateType = !this.dateType ? this.iqsStatisticsDateService.getDateType() : this.dateType;

        each = this.view == iqs.shell.StatisticsView.List && this.isGroup;

        if (params !== null) {
            secondArg = params.deviceId || this.$location.search()['device_stat_id'] || 'all';
        } else {
            secondArg = this.$location.search()['device_stat_id'] ? this.$location.search()['device_stat_id'] : 'all';
        }

        this.iqsStatisticsViewModel.getStatistics(this.statType, secondArg, null, null, this.startDate, this.endDate, this.dateType, each, (data: any) => {
            this.generateStatsDescription();
            this.rangeWithDate = false;
            for (const stat of data.series) {
                if (stat.values && stat.values.length > 1 && stat.values[0].x && stat.values[stat.values.length - 1].x) {
                    const d1 = new Date(stat.values[0].x);
                    const d2 = new Date(stat.values[stat.values.length - 1].x);
                    if (d1.toDateString() !== d2.toDateString()) {
                        this.rangeWithDate = true;
                        break;
                    }
                }
            }
            if (data.series && data.series.length) {
                this.barStatistics = {
                    series: data.series.filter(it => it.key === this.pipTranslate.translate('STATISTICS_STATE_UPDATES'))
                };
            }
        });
    }

    public onOpenDetails(item: any): void {
        if (this.view == iqs.shell.StatisticsView.List) {
            if (this.item.id == 'all' || this.filterParams.objectGroupId) {
                // choose object
                if (this.onDetails) {
                    this.onDetails({ item: item });
                }
            }
        }

    }

    private setDefaultFilterParams(): void {
        this.filterParams.param = this.statType;

        if (this.item.id == 'all' || !this.item.id) {
            this.filterParams.deviceId = null;
            this.filterParams.objectGroupId = null;
        } else if (this.item.object_type == iqs.shell.SearchObjectTypes.Device) {
            this.filterParams.deviceId = this.item.id;
            this.filterParams.objectGroupId = null;
        } else {
            this.filterParams.deviceId = null;
            this.filterParams.objectGroupId = this.item.id;
        }
        this.dateType = this.dateType ? this.dateType : this.iqsStatisticsDateService.getDateType();
        this.filterParams.dateStep = iqs.shell.StatisticsDateSteps[this.dateType];
    }

    public $onChanges(changes: UsagePanelChanges): void {
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

    private setViews(): void {
        if (!this.isGroup && this.view == iqs.shell.StatisticsView.List) {
            this.changeView(iqs.shell.StatisticsView.Chart);
        } else if (this.isGroup && this.view !== this.latestGroupView) {
            this.changeView(this.latestGroupView);
        }
    }

    public changeView(view) {
        let isRequest: boolean = this.view != view && (this.view == iqs.shell.StatisticsView.List || view == iqs.shell.StatisticsView.List);
        this.view = view;
        this.$location.search('view', this.view);
        this.iqsUsageSaveService.view = this.view;
        if (isRequest) {
            this.createStatisticsRequest(this.filterParams);
        }
        if (this.isGroup) {
            this.latestGroupView = view;
        }
    }

    public get statistics() {
        return this.iqsStatisticsViewModel.statistics;
    }
}

(() => {
    angular
        .module('iqsUsagePanel', [
            'iqsStatistics',
            'iqsObjectGroups.ViewModel',
            'iqsObjects.ViewModel',
            'iqsDevices.ViewModel',
            'iqsStatisticsGridExPanel'
        ])
        .component('iqsUsagePanel', {
            bindings: UsagePanelBindings,
            templateUrl: 'statistics/usage/panels/UsagePanel.html',
            controller: UsagePanelController,
            controllerAs: '$ctrl'
        })
})();
