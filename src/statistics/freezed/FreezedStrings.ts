{

    function configureSettingsSystemFreezedTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_FREEZED_DETAILS_TITLE: 'Freezed in zone ',
            STATISTICS_FREEZED_TITLE: 'Freezed',
            FREEZED_EMPTY_TITLE: 'Statistics data was not found',
            FREEZED_EMPTY_SUBTITLE: 'Statistics by freezed time of objects and groups',
            FREEZED_LOADING_TITLE: 'Loading data',


            // STATS_FREEZED_ALL: '',
            // STATS_FREEZED_BY_OBJECT_EACH_ZONE: '',
            // STATS_FREEZED_EACH_OBJECT_OF_GROUP: 'Freezed traveled in kilometers, for objects in selected group, for the given time period, in each zone.',
            // STATS_FREEZED_EACH_OBJECT_ZONE: '',
            // STATS_FREEZED_BY_OBJECT_BY_ZONE: '',
            // STATS_FREEZED_EACH_OBJECT_OF_GROUP_BY_ZONE: '',

            STATISTICS_FREEZED_OBJECT_OF_GROUPS: 'Group objects',
            STATISTICS_FREEZED_OBJECT_AND_GROUPS: 'Object or group',
            STATISTICS_FREEZED_TIME: 'Time',
            STATISTICS_FREEZED_ZONES: 'Zone',
            STATISTICS_FREEZED_VALUE: 'Freezed time',

            STATS_FREEZED_ALL_OBJECTS: 'Freezed time by all objects and groups',
            STATS_FREEZED_GROUP_OBJECTS: 'Freezed time by group objects:',
            STATS_FREEZED_OBJECT: 'Freezed time by object:'
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_FREEZED_DETAILS_TITLE: 'Время замирания в зоне',
            STATISTICS_FREEZED_TITLE: 'Время замирания',
            FREEZED_EMPTY_TITLE: 'Данные не найдены',
            FREEZED_EMPTY_SUBTITLE: 'Время замирания объектами и группами',
            FREEZED_LOADING_TITLE: 'Загрузка данных ..',


            // STATS_FREEZED_ALL: 'Время замирания, для объектов/групп объектов в заданный период времени.',
            // STATS_FREEZED_BY_OBJECT_EACH_ZONE: 'Время замирания, для объекта/группы объектов в заданный период времени в каждой из зон.',
            // STATS_FREEZED_EACH_OBJECT_OF_GROUP: 'Время замирания, для объектов принадлежащих выбранной группе в заданный период времени в каждой из зон.',
            // STATS_FREEZED_EACH_OBJECT_ZONE: 'Время замирания, для объектов/групп объектов в заданный период времени в выбранной зоне.',
            // STATS_FREEZED_BY_OBJECT_BY_ZONE: 'Время замирания, для объекта/группы объектов в заданный период времени в выбранной зоне.',
            // STATS_FREEZED_EACH_OBJECT_OF_GROUP_BY_ZONE: 'Время замирания, для объектов принадлежащих выбранной группе в заданный период времени в выбранной зоне.',

            STATISTICS_FREEZED_OBJECT_OF_GROUPS: 'Объекты группы',
            STATISTICS_FREEZED_OBJECT_AND_GROUPS: 'Объекты и группы',
            STATISTICS_FREEZED_TIME: 'Время',
            STATISTICS_FREEZED_ZONES: 'Зоны',
            STATISTICS_FREEZED_VALUE: 'Время замирания',

            STATS_FREEZED_ALL_OBJECTS: 'Время замирания всеми объектами',
            STATS_FREEZED_GROUP_OBJECTS: 'Время замирания объектами группы: ',
            STATS_FREEZED_OBJECT: 'Время замирания объектом: '
        });
    }

    angular
        .module('iqsNewStatistics.Freezed')
        .config(configureSettingsSystemFreezedTranslations);
}
