import { IObjectParamsSaveService } from './IObjectParamsSaveService';

export const ObjectParamsStateName: string = 'app.params';

class ObjectParamsController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    private mediaSizeGtSm: boolean;
    public details: boolean;
    public accessConfig: any;
    public object: iqs.shell.ControlObject;
    public selectedIndex: number = 0;
    public state: string = iqs.shell.States.Progress;

    public collection: any[] = [
        { id: iqs.shell.StatisticsParams.allParams, name: 'FILTER_PARAMS_ALL' },
        { id: iqs.shell.StatisticsParams.distance, name: 'FILTER_PARAMS_DISTANCE' },
        // { id: StatisticsParams.online, name: 'FILTER_PARAMS_ONLINE' },
        // { id: StatisticsParams.offline, name: 'FILTER_PARAMS_OFFLINE' },
        { id: iqs.shell.StatisticsParams.speed, name: 'FILTER_PARAMS_SPEED' },
        { id: iqs.shell.StatisticsParams.freezed, name: 'FILTER_PARAMS_FREEZED' },
        { id: iqs.shell.StatisticsParams.immobile, name: 'FILTER_PARAMS_IMMOBILE' },
    ];

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        private pipNavService: pip.nav.INavService,
        private pipMedia: pip.layouts.IMediaService,
        private pipTranslate: pip.services.ITranslateService,
        private $rootScope: ng.IRootScopeService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsObjectParamsSaveService: IObjectParamsSaveService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.selectedIndex = Math.max(0, _.findIndex(this.collection,
                (param) => { return param.id == this.iqsObjectParamsSaveService.paramId; }
            ));
            this.selectItem();
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

    private saveCurrentState() {
        this.iqsObjectParamsSaveService.paramId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsObjectParamsSaveService.details = this.details;
    }

    private restoreState() {
        if (!this.$location.search()['param_id'] && this.iqsObjectParamsSaveService.paramId) {
            this.$location.search('param_id', this.iqsObjectParamsSaveService.paramId);
        }

        if (!this.$location.search()['details']) {
            this.$location.search('details', this.iqsObjectParamsSaveService.details);
            this.details = this.iqsObjectParamsSaveService.details;
        } else {
            this.details = this.$location.search()['details']
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
                    title: "STATISTICS_OBJECT_PARAMS_TITLE", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: this.pipTranslate.translate('STATISTICS_OBJECT_PARAMS_DETAILS_TITLE') + this.getSelectedName(), click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'STATISTICS_OBJECT_PARAMS_TITLE';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    public selectItem(index?: number) {
        this.selectedIndex = index || this.selectedIndex;

        if (this.selectedIndex > -1 && this.collection[this.selectedIndex]) {
            this.object = _.cloneDeep(this.collection[this.selectedIndex]);
        } else {
            this.object = null;
        }

        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureObjectParamsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ObjectParamsStateName, {
            url: '/object_params?param_id&details&view&type&date&to_date&params&zone_stat_id',
            controller: ObjectParamsController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'statistics/object_params/ObjectParams.html'
        });
}

function configureObjectParamsAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {

    }

    iqsAccessConfigProvider.registerStateAccess(ObjectParamsStateName, accessLevel);

    iqsAccessConfigProvider.registerStateConfigure(ObjectParamsStateName, accessConfig);
}

(() => {

    angular
        .module('iqsNewStatistics.ObjectParams', [
            'pipNav',
            'iqsObjectParams.SaveService',
            'iqsObjectParamsEmptyPanel',
            'iqsObjectParamsPanel',
            'iqsStatisticsFilterPanel'
        ])
        .config(configureObjectParamsRoute)
        .config(configureObjectParamsAccess);
})();
