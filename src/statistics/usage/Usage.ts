import { IUsageSaveService } from './IUsageSaveService';

export const UsageStateName: string = 'app.usage';

class UsageController implements ng.IController {
    public $onInit() { }
    private mediaSizeGtSm: boolean;
    public details: boolean;
    public accessConfig: any;
    public object: iqs.shell.StatisticsDataCollectionItem;
    public selectedIndex: number = 0;
    public state: string = iqs.shell.States.Progress;
    public statType: string = 'usage';

    public collection: iqs.shell.StatisticsDataCollectionItem[];
    private cf: Function[] = [];

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        private pipScroll: pip.services.IScrollService,
        private pipNavService: pip.nav.INavService,
        private pipMedia: pip.layouts.IMediaService,
        private pipTranslate: pip.services.ITranslateService,
        private $rootScope: ng.IRootScopeService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsUsageSaveService: IUsageSaveService,
        private iqsDevicesViewModel: iqs.shell.IDevicesViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsStatisticsCollectionsService: iqs.shell.IStatisticsCollectionsService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            // this.collection = this.iqsStatisticsCollectionsService.getObjectAndGroupCollection();
            this.prepareCollection();
            this.selectedIndex = Math.max(0, _.findIndex(this.collection,
                (param) => { return param.id == this.iqsUsageSaveService.deviceId; }
            ));
            this.selectItem();
            this.pipScroll.scrollTo('.iqs-scroll-container', '.selected', 500);
            this.state = iqs.shell.States.Data;
        };
        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));

        if (!this.pipMedia('gt-sm')) {
            this.details = $location.search().details == 'details' ? true : false;
        } else {
            this.details = false;
            this.$location.search('details', 'main');
        }

        this.cf.push($rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');

                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                }

                this.appHeader();
            }
        }));

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));
    }

    public $onDestroy() {
        this.saveCurrentState();
        for (const f of this.cf) { f(); }
    }

    private prepareCollection() {
        const groups: iqs.shell.ObjectGroup[] = this.iqsObjectGroupsViewModel.getCollection();
        const devices: iqs.shell.Device[] = this.iqsDevicesViewModel.allDevices;
        const collection = [];
        for (const group of groups) {
            collection.push(<iqs.shell.StatisticsDataCollectionItem>{
                id: group.id,
                name: group.name,
                object_type: iqs.shell.SearchObjectTypes.ObjectGroup
            });
        }
        for (const device of devices) {
            if (!device.object_id) continue;
            const object = this.iqsObjectsViewModel.getObjectById(device.object_id);
            collection.push(<iqs.shell.StatisticsDataCollectionItem>{
                id: device.id,
                name: object && object.name || 'USAGE_UNKNOW_OBJECT',
                object_type: iqs.shell.SearchObjectTypes.Device
            });
        }
        collection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_OBJECT_ALL') });
        this.collection = collection;
    }

    private saveCurrentState() {
        this.iqsUsageSaveService.deviceId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsUsageSaveService.details = this.details;
    }

    private restoreState() {
        if (!this.$location.search()['details']) {
            this.$location.search('details', this.iqsUsageSaveService.details);
            this.details = this.iqsUsageSaveService.details;
        } else {
            this.details = this.$location.search()['details']
        }
        if (!this.$location.search()['device_stat_id'] && this.iqsUsageSaveService.deviceId) {
            this.$location.search('device_stat_id', this.iqsUsageSaveService.deviceId);
        } else {
            if (this.$location.search()['device_stat_id']) {
                this.iqsUsageSaveService.deviceId = this.$location.search()['device_stat_id'];
            }
        }
    }

    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.appHeader();
    }

    private getSelectedName(): string {
        let result: string;
        if (this.selectedIndex > -1 && this.collection && this.collection[this.selectedIndex]) {
            result = ' "' + this.pipTranslate.translate(this.collection[this.selectedIndex].name) + '"'
        }

        return result;
    }

    private appHeader(): void {
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';
        if (!this.pipMedia('gt-sm') && this.details) {
            this.pipNavService.breadcrumb.items = [
                <pip.nav.BreadcrumbItem>{
                    title: "STATISTICS_USAGE_TITLE", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: this.pipTranslate.translate('STATISTICS_USAGE_TITLE') + this.getSelectedName(), click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'STATISTICS_USAGE_TITLE';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    public selectItem(index?: number) {
        this.selectedIndex = index || this.selectedIndex;

        let object;
        if (this.selectedIndex > -1 && this.collection[this.selectedIndex]) {
            object = _.cloneDeep(this.collection[this.selectedIndex]);
        } else {
            object = null;
        }

        if ((object && this.object && this.object.id != object.id) || (object && !this.object || !object && this.object)) {
            this.object = object;
        }

        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public onDetails(item: any): void {
        let index: number = _.findIndex(this.collection, (obj: any) => {
            return obj.name == item.key;
        });

        if (index != -1) {
            this.selectItem(index);
            this.pipScroll.scrollTo('.iqs-scroll-container', '.selected', 500);
        }
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureUsageRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(UsageStateName, {
            url: '/usage?details&view&type&date&to_date&device_stat_id&group_stat_id',
            controller: UsageController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'statistics/usage/Usage.html'
        });
}

function configureUsageAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {

    }

    iqsAccessConfigProvider.registerStateAccess(UsageStateName, accessLevel);

    iqsAccessConfigProvider.registerStateConfigure(UsageStateName, accessConfig);
}

(() => {

    angular
        .module('iqsNewStatistics.Usage', [
            'pipNav',
            'iqsUsage.SaveService',
            'iqsUsageEmptyPanel',
            'iqsUsagePanel',
            'iqsDevices.ViewModel',
            'iqsObjects.ViewModel',
            'iqsObjectGroups.ViewModel'
        ])
        .config(configureUsageRoute)
        .config(configureUsageAccess);
})();
