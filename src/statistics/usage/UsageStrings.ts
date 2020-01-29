{
    function configureSettingsSystemUsageTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_USAGE_TITLE: 'Usage statistics',
            USAGE_EMPTY_TITLE: 'No usage statistics found',
            USAGE_EMPTY_SUBTITLE: 'Usage statistics by objects',
            USAGE_LOADING_TITLE: 'Usage statistics are loading',
            USAGE_UNKNOW_OBJECT: 'Unknown object',
            STATISTICS_USAGE_ALL: 'Usage statistics for all devices',
            STATISTICS_USAGE_DEVICE: 'Usage statistics for device: ',
            STATISTICS_USAGE_GROUP: 'Usage statistics for group: ',
            STATISTICS_USAGE: 'Usage time',
            STATISTICS_STATE_UPDATES: 'Number of events',
            STATISTICS_STATE_ERRORS: 'Errors in processing',
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_USAGE_TITLE: 'Статистики использования',
            USAGE_EMPTY_TITLE: 'Статистика по использованию отсутствует',
            USAGE_EMPTY_SUBTITLE: 'Статистика по использованию объектами устройств',
            USAGE_LOADING_TITLE: 'Загрузка статистики по использованию...',
            USAGE_UNKNOW_OBJECT: 'Неизвестный объект',
            STATISTICS_USAGE_ALL: 'Статистика использования по всем устройствам',
            STATISTICS_USAGE_DEVICE: 'Статистика использования по устройству: ',
            STATISTICS_USAGE_GROUP: 'Статистика использования по группе: ',
            STATISTICS_USAGE: 'Время использования',
            STATISTICS_STATE_UPDATES: 'Количество событий',
            STATISTICS_STATE_ERRORS: 'Ошибки при обработке',
        });
    }

    angular
        .module('iqsNewStatistics.Usage')
        .config(configureSettingsSystemUsageTranslations);
}
