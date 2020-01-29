import { IObjectEventsSaveService } from './IObjectEventsSaveService';

export const ObjectEventsStateName: string = 'app.events';

class ObjectEventsController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    private mediaSizeGtSm: boolean;
    public details: boolean;
    public accessConfig: any;
    public object: iqs.shell.ControlObject;
    public selectedIndex: number = 0;
    public state: string = iqs.shell.States.Progress;

    public collection: any[] = [
        { id: 'all', name: 'FILTER_EVENT_RULE_ALL' }
    ];

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
        private iqsObjectEventsSaveService: IObjectEventsSaveService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            _.each(this.iqsEventRulesViewModel.getCollection(), (item: any) => {
                this.collection.push({
                    id: item.id,
                    name: item.name
                });
            });
            this.selectedIndex = Math.max(0, _.findIndex(this.collection, (item) => {
                return this.iqsObjectEventsSaveService.eventId == item.id;
            }));
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

    private saveCurrentState() {
        this.iqsObjectEventsSaveService.eventId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsObjectEventsSaveService.details = this.details;
    }

    private restoreState() {
        if (!this.$location.search()['event_stat_id'] && this.iqsObjectEventsSaveService.eventId) {
            this.$location.search('event_stat_id', this.iqsObjectEventsSaveService.eventId);
        } else {
            if (this.$location.search()['event_stat_id']) {
                this.iqsObjectEventsSaveService.eventId = this.$location.search()['event_stat_id'];
            }
        }

        if (!this.$location.search()['details']) {
            this.$location.search('details', this.iqsObjectEventsSaveService.details);
            this.details = this.iqsObjectEventsSaveService.details;
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
                    title: "STATISTICS_OBJECT_EVENTS_TITLE", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: this.pipTranslate.translate('STATISTICS_OBJECT_EVENTS_DETAILS_TITLE') + this.getSelectedName(), click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'STATISTICS_OBJECT_EVENTS_TITLE';
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

function configureObjectEventsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ObjectEventsStateName, {
            url: '/object_events?event_stat_id&details&view&type&date&to_date&object_stat_id&zone_stat_id',
            controller: ObjectEventsController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'statistics/object_events/ObjectEvents.html'
        });
}

function configureObjectEventsAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {}

    iqsAccessConfigProvider.registerStateAccess(ObjectEventsStateName, accessLevel);

    iqsAccessConfigProvider.registerStateConfigure(ObjectEventsStateName, accessConfig);
}

(() => {

    angular
        .module('iqsNewStatistics.ObjectEvents', [
            'pipNav',
            'iqsEventRules.ViewModel',
            'iqsObjectEvents.SaveService',
            'iqsObjectEventsEmptyPanel',
            'iqsObjectEventsPanel',
        ])
        .config(configureObjectEventsRoute)
        .config(configureObjectEventsAccess);
})();
