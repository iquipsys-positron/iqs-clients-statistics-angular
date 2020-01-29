(() => {
    function iqsPositronStatisticsConfig(
        pipAuthStateProvider: pip.rest.IAuthStateProvider,
        pipErrorPageConfigServiceProvider: pip.errors.IErrorPageConfigProvider,
    ) {
        pipAuthStateProvider.authorizedState = 'app.distance';
        pipErrorPageConfigServiceProvider.configs.NoConnection.RedirectSateDefault = pipAuthStateProvider.authorizedState;

    }

    angular
        .module('iqsPositronStatistics.Config', [
            'ngCookies',
            'iqsShell',
            'pipSystem',
            'pipSystem.Templates',
        ])
        .config(iqsPositronStatisticsConfig);
})();