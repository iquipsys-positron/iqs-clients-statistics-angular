{

    function configureSettingsSystemImmobileTranslations(
        pipTranslateProvider: pip.services.ITranslateProvider
    ) {
        pipTranslateProvider.translations('en', {
            STATISTICS_IMMOBILE_DETAILS_TITLE: 'Immobile in zone ',
            STATISTICS_IMMOBILE_TITLE: 'Immobile',
            IMMOBILE_EMPTY_TITLE: 'Statistics data was not found',
            IMMOBILE_EMPTY_SUBTITLE: 'Statistics by immobile time of objects and groups',
            IMMOBILE_LOADING_TITLE: 'Loading data',


            // STATS_IMMOBILE_ALL: '',
            // STATS_IMMOBILE_BY_OBJECT_EACH_ZONE: '',
            // STATS_IMMOBILE_EACH_OBJECT_OF_GROUP: 'Immobile traveled in kilometers, for objects in selected group, for the given time period, in each zone.',
            // STATS_IMMOBILE_EACH_OBJECT_ZONE: '',
            // STATS_IMMOBILE_BY_OBJECT_BY_ZONE: '',
            // STATS_IMMOBILE_EACH_OBJECT_OF_GROUP_BY_ZONE: '',

            STATISTICS_IMMOBILE_OBJECT_OF_GROUPS: 'Group objects',
            STATISTICS_IMMOBILE_OBJECT_AND_GROUPS: 'Object or group',
            STATISTICS_IMMOBILE_TIME: 'Time',
            STATISTICS_IMMOBILE_ZONES: 'Zone',
            STATISTICS_IMMOBILE_VALUE: 'Immobile time',

            STATS_IMMOBILE_ALL_OBJECTS: 'Immobile time by all objects and groups',
            STATS_IMMOBILE_GROUP_OBJECTS: 'Immobile time by group objects:',
            STATS_IMMOBILE_OBJECT: 'Immobile time by object:'
        });

        pipTranslateProvider.translations('ru', {
            STATISTICS_IMMOBILE_DETAILS_TITLE: 'Время неподвижности в зоне',
            STATISTICS_IMMOBILE_TITLE: 'Время неподвижности',
            IMMOBILE_EMPTY_TITLE: 'Данные не найдены',
            IMMOBILE_EMPTY_SUBTITLE: 'Время неподвижности объектами и группами',
            IMMOBILE_LOADING_TITLE: 'Загрузка данных ..',


            // STATS_IMMOBILE_ALL: 'Время неподвижности, для объектов/групп объектов в заданный период времени.',
            // STATS_IMMOBILE_BY_OBJECT_EACH_ZONE: 'Время неподвижности, для объекта/группы объектов в заданный период времени в каждой из зон.',
            // STATS_IMMOBILE_EACH_OBJECT_OF_GROUP: 'Время неподвижности, для объектов принадлежащих выбранной группе в заданный период времени в каждой из зон.',
            // STATS_IMMOBILE_EACH_OBJECT_ZONE: 'Время неподвижности, для объектов/групп объектов в заданный период времени в выбранной зоне.',
            // STATS_IMMOBILE_BY_OBJECT_BY_ZONE: 'Время неподвижности, для объекта/группы объектов в заданный период времени в выбранной зоне.',
            // STATS_IMMOBILE_EACH_OBJECT_OF_GROUP_BY_ZONE: 'Время неподвижности, для объектов принадлежащих выбранной группе в заданный период времени в выбранной зоне.',

            STATISTICS_IMMOBILE_OBJECT_OF_GROUPS: 'Объекты группы',
            STATISTICS_IMMOBILE_OBJECT_AND_GROUPS: 'Объекты и группы',
            STATISTICS_IMMOBILE_TIME: 'Время',
            STATISTICS_IMMOBILE_ZONES: 'Зоны',
            STATISTICS_IMMOBILE_VALUE: 'Время неподвижности',

            STATS_IMMOBILE_ALL_OBJECTS: 'Время неподвижности всеми объектами',
            STATS_IMMOBILE_GROUP_OBJECTS: 'Время неподвижности объектами группы: ',
            STATS_IMMOBILE_OBJECT: 'Время неподвижности объектом: '
        });
    }

    angular
        .module('iqsNewStatistics.Immobile')
        .config(configureSettingsSystemImmobileTranslations);
}
