/// <reference path="../typings/tsd.d.ts" />
class PositronStatisticsAppController implements ng.IController {
    public $onInit() { }
    public isChrome: boolean;

    constructor(
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        pipSystemInfo: pip.services.ISystemInfo,
    ) {
        "ngInject";

        this.isChrome = pipSystemInfo.browserName == 'chrome' && pipSystemInfo.os == 'windows';
    }
}

angular
    .module('iqsPositronStatisticsApp', [
        'iqsPositronStatistics.Config',
        'iqsPositronStatistics.Templates',
        'iqsOrganizations.Service',
        'iqsNewStatistics'
    ])
    .controller('iqsPositronStatisticsAppController', PositronStatisticsAppController);


