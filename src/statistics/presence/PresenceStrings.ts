{
    
        function configureSettingsSystemPresenceTranslations(
            pipTranslateProvider: pip.services.ITranslateProvider
        ) {
            pipTranslateProvider.translations('en', {
                STATISTICS_PRESENCE_DETAILS_TITLE: 'Presence time in zone ',
                STATISTICS_PRESENCE_TITLE: 'Presence time',
                PRESENCE_EMPTY_TITLE: 'Presence time was not found',
                PRESENCE_EMPTY_SUBTITLE: 'Statistics by presence time of objects and groups',
                PRESENCE_LOADING_TITLE: 'Loading data',
                STATS_PRESENCE_GROUPED_BY_OBJECT: 'Total presence time grouped by objects',
                STATS_PRESENCE_SPECIFIC: 'The total presence time of an object or object group',

                STATS_PRESENCE_ALL_ZONE: 'Presence time in all zone',
                STATS_PRESENCE_IN_ZONE: 'Presence time in zone: ',
                // STATS_PRESENCE_BY_OBJECT_EACH_ZONE: '',
                // STATS_PRESENCE_EACH_OBJECT_OF_GROUP: 'The total presence for objects in selected group, for the given time period, in each zone.',
                // STATS_PRESENCE_EACH_OBJECT_ZONE: '',
                // STATS_PRESENCE_BY_OBJECT_BY_ZONE: '',
                // STATS_PRESENCE_EACH_OBJECT_OF_GROUP_BY_ZONE: '',

                STATISTICS_PRESENCE_OBJECT_OF_GROUPS: 'Group objects',
                STATISTICS_PRESENCE_OBJECT_AND_GROUPS: 'Object or Group',
                STATISTICS_PRESENCE_TIME: 'Time',
                STATISTICS_PRESENCE_ZONES: 'Zone',
                STATISTICS_PRESENCE_VALUE: 'Presence time',
            });
    
            pipTranslateProvider.translations('ru', {
                STATISTICS_PRESENCE_DETAILS_TITLE: 'Время пребывания в зоне',
                STATISTICS_PRESENCE_TITLE: 'Время пребывания',
                PRESENCE_EMPTY_TITLE: 'Время пребывания не найдено',
                PRESENCE_EMPTY_SUBTITLE: 'Статитстика по времени пребывания объектов и групп',
                PRESENCE_LOADING_TITLE: 'Загрузка данных',
                STATS_PRESENCE_GROUPED_BY_OBJECT: 'Суммарное время пребывания сгруппированное по объектам',
                STATS_PRESENCE_SPECIFIC: 'Суммарное время пребывания объекта или группы объектов',

                STATS_PRESENCE_ALL_ZONE: 'Время пребывания во всех зонах',
                STATS_PRESENCE_IN_ZONE: 'Время пребывания в зоне: ',
                // STATS_PRESENCE_BY_OBJECT_EACH_ZONE: 'Суммарное время пребывания, для объекта/группы объектов в заданный период времени в каждой из зон.',
                // STATS_PRESENCE_EACH_OBJECT_OF_GROUP: 'Суммарное время пребывания, для объектов принадлежащих выбранной группе в заданный период времени в каждой из зон.',
                // STATS_PRESENCE_EACH_OBJECT_ZONE: 'Суммарное время пребывания, для объектов/групп объектов в заданный период времени в выбранной зоне.',
                // STATS_PRESENCE_BY_OBJECT_BY_ZONE: 'Суммарное время пребывания, для объекта/группы объектов в заданный период времени в выбранной зоне.',
                // STATS_PRESENCE_EACH_OBJECT_OF_GROUP_BY_ZONE: 'Суммарное время пребывания, для объектов принадлежащих выбранной группе в заданный период времени в выбранной зоне.',

                STATISTICS_PRESENCE_OBJECT_OF_GROUPS: 'Объекты группы',
                STATISTICS_PRESENCE_OBJECT_AND_GROUPS: 'Объекты или группы',
                STATISTICS_PRESENCE_TIME: 'Время',
                STATISTICS_PRESENCE_ZONES: 'Зоны',
                STATISTICS_PRESENCE_VALUE: 'Время пребывания',
            });
        }
    
        angular
            .module('iqsNewStatistics.Presence')
            .config(configureSettingsSystemPresenceTranslations);
    }
    