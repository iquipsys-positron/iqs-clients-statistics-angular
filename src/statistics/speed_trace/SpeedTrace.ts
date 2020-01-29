import { ISpeedTraceSaveService } from './ISpeedTraceSaveService';

export const SpeedTraceStateName: string = 'app.speed_trace';

class SpeedTraceController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    private mediaSizeGtSm: boolean;
    public details: boolean;
    public accessConfig: any;
    public object: iqs.shell.ControlObject;

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
        private iqsSpeedTraceSaveService: ISpeedTraceSaveService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        "ngInject";

        this.restoreState();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.iqsObjectsViewModel.initObjects(iqs.shell.ObjectCategory.Equipment, () => {
                this.selectItem();
            });
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
        this.iqsSpeedTraceSaveService.objectId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsSpeedTraceSaveService.details = this.details;
    }

    private restoreState() {
        if (!this.$location.search()['object_id'] && this.iqsSpeedTraceSaveService.objectId) {
            this.$location.search('object_id', this.iqsSpeedTraceSaveService.objectId);
        }

        if (!this.$location.search()['details']) {
            this.$location.search('details', this.iqsSpeedTraceSaveService.details);
            this.details = this.iqsSpeedTraceSaveService.details;
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
            result = ' "' + this.collection[this.selectedIndex].name + '"'
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
                    title: "STATISTICS_SPEED_TRACE_TITLE", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: 'STATISTICS_SPEED_TRACE_DETAILS_TITLE' + this.getSelectedName(), click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'STATISTICS_SPEED_TRACE_TITLE';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    public selectItem(index?: number) {
        this.iqsObjectsViewModel.selectItem(index);

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

    public get selectedIndex() {
        return this.iqsObjectsViewModel.selectedIndex;
    }

    public set selectedIndex(value: number) {

    }

    public get collection(): iqs.shell.ControlObject[] {
        return this.iqsObjectsViewModel.getObjects();
    }

    public get state(): string {
        return this.iqsObjectsViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsObjectsViewModel.getTransaction();
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureSpeedTraceRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(SpeedTraceStateName, {
            url: '/speed_trace?object_id&details&view&type&date&params',
            controller: SpeedTraceController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'statistics/speed_trace/SpeedTrace.html'
        });
}

function configureSpeedTraceAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {

    }

    iqsAccessConfigProvider.registerStateAccess(SpeedTraceStateName, accessLevel);

    iqsAccessConfigProvider.registerStateConfigure(SpeedTraceStateName, accessConfig);
}

(() => {

    angular
        .module('iqsNewStatistics.SpeedTrace', [
            'pipNav',
            'iqsSpeedTrace.SaveService',
            'iqsSpeedTraceEmptyPanel',
            'iqsSpeedTracePanel',
            'iqsObjects.ViewModel'
        ])
        .config(configureSpeedTraceRoute)
        .config(configureSpeedTraceAccess);
})();
