{

    function configureSettingsSystemObjectParamsTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_OBJECT_PARAMS_DETAILS_TITLE: 'Statistics by parameter',
            STATISTICS_OBJECT_PARAMS_TITLE: 'Parameters',
            OBJECT_PARAMS_EMPTY_TITLE: 'Parameters were not found',
            OBJECT_PARAMS_EMPTY_SUBTITLE: 'Statistics by parameters for objects and groups',
            OBJECT_PARAMS_LOADING_TITLE: 'Loading data',
            STATS_PARAMS_SPEED: 'The average speed is calculated based on the distance traveled and may not take into account the instantaneous acceleration of the object',
            STATS_PARAMS_SPECIFIC: 'Total values for the selected period of time',
            STATISTICS_BY_ALL_PARAMS: 'Total values for the selected period of time',
            STATISTICS_OBJECT_PARAMS_TIME: 'Time',
            STATISTICS_OBJECT_PARAMS_AVG_SPEED: 'Avg. speed',
            STATISTICS_LOADING_TITLE: 'Statistics loading...',
            STATISTICS_BY_PARAM: 'Statistics by parameter',
            FOR_DATE: 'for',
            FOR_DATE_WEEK: 'for week from',
            FOR: 'for',
            KM: 'km',
            KM_IN_H: 'km/h',
            HOURS: 'h',
            MINUTES: 'm',
            SECONDS: 's',
            PARAMETER: 'Parameter',
            VALUE: 'Value',
            STATISTICS_HOUR: 'Time',
            STATISTICS_DAY: 'Day',
            STATISTICS_MONTH: 'Month',
            STATISTICS_BY_ALL_EVENTS: 'Statistics by all events',
            EVENT: 'Event',
            STATISTICS_BY_EVENT: 'Statistics by event',
            NUMBER_OF_EVENTS: 'Number',
            STATISTICS_BY_ALL_ZONES: 'Statistics by all zones',
            STATISTICS_BY_ZONE: 'Statistics by zone',
            ZONE: 'Zone',
            PRESENCE_DURATION: 'Duration',
            HORIZONTAL_BARS_NO_DATA: 'No statistics data'
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_OBJECT_PARAMS_DETAILS_TITLE: 'Статистики по параметру',
            STATISTICS_OBJECT_PARAMS_TITLE: 'Параметры',
            OBJECT_PARAMS_EMPTY_TITLE: 'Параметры не найдены',
            OBJECT_PARAMS_EMPTY_SUBTITLE: 'Статитстика по параметрам для объектов и групп',
            OBJECT_PARAMS_LOADING_TITLE: 'Загрузка данных',
            STATS_PARAMS_SPEED: 'Средняя скорость расчитывается на основе пройденного расстояния и может не учитывать мгновенные ускорения объекта',
            STATS_PARAMS_SPECIFIC: 'Суммарные значения за выбранный промежуток времени',
            STATISTICS_BY_ALL_PARAMS: 'Суммарные значения  за выбранный промежуток времени',
            STATISTICS_OBJECT_PARAMS_TIME: 'Время',
            STATISTICS_OBJECT_PARAMS_AVG_SPEED: 'Средняя скорость',
            STATISTICS_LOADING_TITLE: 'Статистики загружаются...',
            STATISTICS_BY_PARAM: 'Статистика по параметру',
            FOR_DATE: 'за',
            FOR_DATE_WEEK: 'за неделю с',
            FOR: 'для',
            KM: 'км',
            KM_IN_H: 'км/ч',
            HOURS: 'ч',
            MINUTES: 'м',
            SECONDS: 'с',
            PARAMETER: 'Параметр',
            VALUE: 'Значение',
            STATISTICS_HOUR: 'Время',
            STATISTICS_DAY: 'День',
            STATISTICS_MONTH: 'Месяц',
            STATISTICS_BY_ALL_EVENTS: 'Статистика по всем событиям',
            EVENT: 'Событие',
            STATISTICS_BY_EVENT: 'Статистика по событию',
            NUMBER_OF_EVENTS: 'Количество',
            STATISTICS_BY_ALL_ZONES: 'Стастистика по всем зонам',
            STATISTICS_BY_ZONE: 'Статистика по зоне',
            ZONE: 'Зона',
            PRESENCE_DURATION: 'Длительность',
            HORIZONTAL_BARS_NO_DATA: 'Нет статистических данных'
        });
    }

    angular
        .module('iqsNewStatistics.ObjectParams')
        .config(configureSettingsSystemObjectParamsTranslations);

}
