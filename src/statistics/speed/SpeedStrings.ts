{
    
        function configureSettingsSystemSpeedTranslations(
            pipTranslateProvider: pip.services.ITranslateProvider
        ) {
            pipTranslateProvider.translations('en', {
                STATISTICS_SPEED_DETAILS_TITLE: 'Average speed in zone ',
                STATISTICS_SPEED_TITLE: 'Average speed',
                DISTANCE_EMPTY_TITLE: 'Data was not found',
                DISTANCE_EMPTY_SUBTITLE: 'Statistics by Average speed by group objects',
                DISTANCE_LOADING_TITLE: 'Loading data',


                // STATS_SPEED_ALL: '',
                // STATS_SPEED_BY_OBJECT_EACH_ZONE: '',
                // STATS_SPEED_EACH_OBJECT_OF_GROUP: 'Speed traveled in kilometers, for objects in selected group, for the given time period, in each zone.',
                // STATS_SPEED_EACH_OBJECT_ZONE: '',
                // STATS_SPEED_BY_OBJECT_BY_ZONE: '',
                // STATS_SPEED_EACH_OBJECT_OF_GROUP_BY_ZONE: '',

                STATISTICS_SPEED_OBJECT_OF_GROUPS: 'Group objects',
                STATISTICS_SPEED_OBJECT_AND_GROUPS: 'Object or group',
                STATISTICS_SPEED_TIME: 'Time',
                STATISTICS_SPEED_ZONES: 'Zone',
                STATISTICS_SPEED_VALUE: 'Average speed',

                STATS_SPEED_ALL_OBJECTS: 'Average speed by all objects and groups',
                STATS_SPEED_GROUP_OBJECTS: 'Average speed by group objects:',
                STATS_SPEED_OBJECT: 'Average speed by object:'
            });
    
            pipTranslateProvider.translations('ru', {
                STATISTICS_SPEED_DETAILS_TITLE: 'Средняя скорость в зоне',
                STATISTICS_SPEED_TITLE: 'Средняя скорость',
                DISTANCE_EMPTY_TITLE: 'Данные не найдены',
                DISTANCE_EMPTY_SUBTITLE: 'Средняя скорость для объектов и групп',
                DISTANCE_LOADING_TITLE: 'Загрузка данных ..',


                // STATS_SPEED_ALL: 'Пройденное расстояние, для объектов/групп объектов в заданный период времени.',
                // STATS_SPEED_BY_OBJECT_EACH_ZONE: 'Пройденное расстояние, для объекта/группы объектов в заданный период времени в каждой из зон.',
                // STATS_SPEED_EACH_OBJECT_OF_GROUP: 'Пройденное расстояние, для объектов принадлежащих выбранной группе в заданный период времени в каждой из зон.',
                // STATS_SPEED_EACH_OBJECT_ZONE: 'Пройденное расстояние, для объектов/групп объектов в заданный период времени в выбранной зоне.',
                // STATS_SPEED_BY_OBJECT_BY_ZONE: 'Пройденное расстояние, для объекта/группы объектов в заданный период времени в выбранной зоне.',
                // STATS_SPEED_EACH_OBJECT_OF_GROUP_BY_ZONE: 'Пройденное расстояние, для объектов принадлежащих выбранной группе в заданный период времени в выбранной зоне.',

                STATISTICS_SPEED_OBJECT_OF_GROUPS: 'Объекты группы',
                STATISTICS_SPEED_OBJECT_AND_GROUPS: 'Объекты и группы',
                STATISTICS_SPEED_TIME: 'Время',
                STATISTICS_SPEED_ZONES: 'Зоны',
                STATISTICS_SPEED_VALUE: 'Средняя скорость',

                STATS_SPEED_ALL_OBJECTS: 'Средняя скорость для всех объектов и групп',
                STATS_SPEED_GROUP_OBJECTS: 'Средняя скорость для объектов группы: ',
                STATS_SPEED_OBJECT: 'Средняя скорость объекта: '
            });
        }
    
        angular
            .module('iqsNewStatistics.Speed')
            .config(configureSettingsSystemSpeedTranslations);
    }
