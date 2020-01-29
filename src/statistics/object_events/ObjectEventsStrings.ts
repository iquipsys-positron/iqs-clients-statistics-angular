{

    function configureSettingsSystemObjectEventsTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_OBJECT_EVENTS_DETAILS_TITLE: 'Statistics for event',
            STATISTICS_OBJECT_EVENTS_TITLE: 'Events',
            OBJECT_EVENTS_EMPTY_TITLE: 'Events were not found',
            OBJECT_EVENTS_EMPTY_SUBTITLE: 'Statistics by events for objects and groups',
            OBJECT_EVENTS_LOADING_TITLE: 'Loading data',
            STATS_EVENTS_ALL: 'Total number of events for the selected period of time',
            STATS_EVENTS_GROUPED_BY_OBJECT: 'The number of grouped by objects events that occurred in specified time',
            STATS_EVENTS_SPECIFIC: 'The number of events that occurred in specified time',

            STATISTICS_EVENTS_VALUE: 'Number of events',
            STATISTICS_EVENTS_TIME: 'Time',
            STATISTICS_EVENTS_ZONES: 'Zone',
            STATISTICS_EVENTS_RULE_NAME: 'Event'
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_OBJECT_EVENTS_DETAILS_TITLE: 'Статистики для события',
            STATISTICS_OBJECT_EVENTS_TITLE: 'События',
            OBJECT_EVENTS_EMPTY_TITLE: 'События не найдены',
            OBJECT_EVENTS_EMPTY_SUBTITLE: 'Статитстика по Событиям для объектов и групп',
            OBJECT_EVENTS_LOADING_TITLE: 'Загрузка данных',
            STATS_EVENTS_ALL: 'Суммарное количество событий за выбранный промежуток времени',
            STATS_EVENTS_GROUPED_BY_OBJECT: 'Количество произошедших событий во времени сгруппированные по объектам',
            STATS_EVENTS_SPECIFIC: 'Количество произошедших событий во времени',

            STATISTICS_EVENTS_VALUE: 'Количество событий',
            STATISTICS_EVENTS_TIME: 'Время',
            STATISTICS_EVENTS_ZONES: 'Зоны',
            STATISTICS_EVENTS_RULE_NAME: 'Событие'
        });
    }

    angular
        .module('iqsNewStatistics.ObjectEvents')
        .config(configureSettingsSystemObjectEventsTranslations);

}