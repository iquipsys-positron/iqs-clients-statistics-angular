{

    function configureStatisticsHomeTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS: 'Statistics',
            STATS_PARAMETRS: 'Parametrs',
            STATS_EVENTS: 'Events',
            STATS_TIME: 'Presence time',
            STATS_SPEED: 'Average speed',
            STATS_DISTANCE: 'Distance',
            STATS_DISTANCE_SHORT: 'Distance',
            STATS_IMMOBILE: 'Immobile',
            STATS_FREEZE: 'Freezed',
            STATS_MANUAL_CORRECTIONS: 'Manual corrections',
            STATS_SPEED_TRACE: 'Speed trends',
            GRID_SUMM_LABEL: 'Total',
            GRID_NO_DATA: 'No statistics data',
            STATISTICS_GRID_NAME: 'Name',
            STATISTICS_GRID_VALUE: 'Value',
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS: 'Статистика',
            STATS_PARAMETRS: 'Параметры',
            STATS_EVENTS: 'События',
            STATS_TIME: 'Время пребывания',
            STATS_SPEED: 'Средняя скорость',
            STATS_DISTANCE: 'Пройденное расстояние',
            STATS_DISTANCE_SHORT: 'Расстояние',
            STATS_IMMOBILE: 'Неподвижность',
            STATS_FREEZE: 'Замирание',
            STATS_MANUAL_CORRECTIONS: 'Ручные коррекции',
            STATS_SPEED_TRACE: 'Тренды скорости',
            GRID_SUMM_LABEL: 'Итого',
            GRID_NO_DATA: 'Нет статистических данных',
            STATISTICS_GRID_NAME: 'Имя',
            STATISTICS_GRID_VALUE: 'Значение',
        });
    }

    angular
        .module('iqsNewStatistics')
        .config(configureStatisticsHomeTranslations);

}
