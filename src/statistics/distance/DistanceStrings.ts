{

    function configureSettingsSystemDistanceTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_DISTANCE_DETAILS_TITLE: 'Distance traveled in zone ',
            STATISTICS_DISTANCE_TITLE: 'Distance traveled',
            DISTANCE_EMPTY_TITLE: 'Distance traveled was not found',
            DISTANCE_EMPTY_SUBTITLE: 'Statistics by distance time of objects and groups',
            DISTANCE_LOADING_TITLE: 'Loading data',


            // STATS_DISTANCE_ALL: '',
            // STATS_DISTANCE_BY_OBJECT_EACH_ZONE: '',
            // STATS_DISTANCE_EACH_OBJECT_OF_GROUP: 'Distance traveled in kilometers, for objects in selected group, for the given time period, in each zone.',
            // STATS_DISTANCE_EACH_OBJECT_ZONE: '',
            // STATS_DISTANCE_BY_OBJECT_BY_ZONE: '',
            // STATS_DISTANCE_EACH_OBJECT_OF_GROUP_BY_ZONE: '',

            STATISTICS_DISTANCE_OBJECT_OF_GROUPS: 'Group objects',
            STATISTICS_DISTANCE_OBJECT_AND_GROUPS: 'Object or group',
            STATISTICS_DISTANCE_TIME: 'Time',
            STATISTICS_DISTANCE_ZONES: 'Zone',
            STATISTICS_DISTANCE_VALUE: 'Distance traveled',

            STATS_DISTANCE_ALL_OBJECTS: 'Distance traveled by all objects and groups',
            STATS_DISTANCE_GROUP_OBJECTS: 'Distance traveled by group objects:',
            STATS_DISTANCE_OBJECT: 'Distance traveled by object:'
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_DISTANCE_DETAILS_TITLE: 'Расстояние пройденное в зоне',
            STATISTICS_DISTANCE_TITLE: 'Пройденное расстояние',
            DISTANCE_EMPTY_TITLE: 'Данные не найдены',
            DISTANCE_EMPTY_SUBTITLE: 'Пройденное расстояние объектами и группами',
            DISTANCE_LOADING_TITLE: 'Загрузка данных ..',


            // STATS_DISTANCE_ALL: 'Пройденное расстояние, для объектов/групп объектов в заданный период времени.',
            // STATS_DISTANCE_BY_OBJECT_EACH_ZONE: 'Пройденное расстояние, для объекта/группы объектов в заданный период времени в каждой из зон.',
            // STATS_DISTANCE_EACH_OBJECT_OF_GROUP: 'Пройденное расстояние, для объектов принадлежащих выбранной группе в заданный период времени в каждой из зон.',
            // STATS_DISTANCE_EACH_OBJECT_ZONE: 'Пройденное расстояние, для объектов/групп объектов в заданный период времени в выбранной зоне.',
            // STATS_DISTANCE_BY_OBJECT_BY_ZONE: 'Пройденное расстояние, для объекта/группы объектов в заданный период времени в выбранной зоне.',
            // STATS_DISTANCE_EACH_OBJECT_OF_GROUP_BY_ZONE: 'Пройденное расстояние, для объектов принадлежащих выбранной группе в заданный период времени в выбранной зоне.',

            STATISTICS_DISTANCE_OBJECT_OF_GROUPS: 'Объекты группы',
            STATISTICS_DISTANCE_OBJECT_AND_GROUPS: 'Объекты и группы',
            STATISTICS_DISTANCE_TIME: 'Время',
            STATISTICS_DISTANCE_ZONES: 'Зоны',
            STATISTICS_DISTANCE_VALUE: 'Пройденный путь',

            STATS_DISTANCE_ALL_OBJECTS: 'Пройденное расстояние всеми объектами',
            STATS_DISTANCE_GROUP_OBJECTS: 'Пройденное расстояние объектами группы: ',
            STATS_DISTANCE_OBJECT: 'Пройденное расстояние объектом: '
        });
    }

    angular
        .module('iqsNewStatistics.Distance')
        .config(configureSettingsSystemDistanceTranslations);
}
