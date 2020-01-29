import './distance/Distance';
import './freezed/Freezed';
import './immobile/Immobile';
import './object_events/ObjectEvents';
import './object_params/ObjectParams';
import './presence/Presence';
import './speed/Speed';
// import './speed_trace/SpeedTrace';
import './usage/Usage';

export const NewStatisticsStateName: string = 'app';

(() => {
    function configureNewStatisticsRoute(
        $injector: angular.auto.IInjectorService,
        $stateProvider: pip.rest.IAuthStateService
    ) {
        "ngInject";
        $stateProvider
            .state(NewStatisticsStateName, {
                url: '',
                abstract: true,
                auth: true,
                reloadOnSearch: false,
                views: {
                    '@': {
                        template: "<div class='iqs-statistics' ui-view></div>"
                    }
                }
            })
    }

    function configureNewStatisticsAccess(
        iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
    ) {
        "ngInject";

        let accessLevel: number = iqs.shell.AccessRole.user;
        let accessConfig: any = {}

        iqsAccessConfigProvider.registerStateAccess(NewStatisticsStateName, accessLevel);

        iqsAccessConfigProvider.registerStateConfigure(NewStatisticsStateName, accessConfig);
    }

    angular
        .module('iqsNewStatistics', [
            // 'iqsNewStatistics.SpeedTrace',
            'iqsNewStatistics.ObjectParams',
            'iqsNewStatistics.ObjectEvents',
            'iqsNewStatistics.Presence',
            'iqsNewStatistics.Distance',
            'iqsNewStatistics.Freezed',
            'iqsNewStatistics.Immobile',
            'iqsNewStatistics.Speed',
            'iqsNewStatistics.Usage',
            'iqsStatistics.CollectionsService',
            'iqsFilterDialog',
            'iqsStatisticsGridPanel'
        ])
        .config(configureNewStatisticsRoute)
        .config(configureNewStatisticsAccess);
})();

