{

    function configureSettingsSystemSpeedTraceTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_SPEED_TRACE_DETAILS_TITLE: 'Speed trend for ',
            STATISTICS_SPEED_TRACE_TITLE: 'Speed trend',
            SPEED_TRACE_EMPTY_TITLE: 'Object were not found',
            SPEED_TRACE_EMPTY_SUBTITLE: 'Speed trends for objects of the category "Equipment"',
            SPEED_TRACE_LOADING_TITLE: 'Loading data'
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_SPEED_TRACE_DETAILS_TITLE: 'Тренд скорости для',
            STATISTICS_SPEED_TRACE_TITLE: 'Тренд скорости',
            SPEED_TRACE_EMPTY_TITLE: 'Объекты наблюдения не найдены',
            SPEED_TRACE_EMPTY_SUBTITLE: 'Тренды скорости стоятся для объектов категории "Машины"',
            SPEED_TRACE_LOADING_TITLE: 'Загрузка данных'

        });
    }

    angular
        .module('iqsNewStatistics.SpeedTrace')
        .config(configureSettingsSystemSpeedTraceTranslations);

}
