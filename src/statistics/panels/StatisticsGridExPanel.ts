import { map } from 'lodash';

class GridExDetailsParams {
    public item: any;
}

interface IStatisticsGridExPanelBindings {
    [key: string]: any;

    data: any;
    statType: any;
    gridType: any;
    dateType: any;
    openDetails: any;
    formatY: any;
    formatX: any;
    nameLabel: any;
    valueLabels: any;
}

const StatisticsGridExPanelBindings: IStatisticsGridExPanelBindings = {
    data: '<?iqsGridData',
    statType: '=?iqsStatType',
    gridType: '=?iqsGridType',
    dateType: '=?iqsGridType',
    openDetails: '&iqsOpenDetails',
    formatY: '=?iqsFormatGridY',
    formatX: '=?iqsFormatGridX',
    nameLabel: '=?iqsNameLabel',
    valueLabels: '=?iqsValueLabels',
}

class StatisticsGridExPanelChanges implements ng.IOnChangesObject, IStatisticsGridExPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    data: ng.IChangesObject<any>;
    statType: ng.IChangesObject<string>;
    gridType: ng.IChangesObject<string>;
    dateType: ng.IChangesObject<string>;
    openDetails: ng.IChangesObject<() => ng.IPromise<void>>;
    formatY: ng.IChangesObject<() => ng.IPromise<void>>;
    formatX: ng.IChangesObject<() => ng.IPromise<void>>;
    nameLabel: ng.IChangesObject<string>;
    valueLabels: ng.IChangesObject<string[]>;
}

class StatisticsGridExPanelController implements IStatisticsGridExPanelBindings {
    public data: any;
    public statType: string;
    public gridType: string;
    public dateType: string;
    public nameLabel: string;
    public valueLabels: string[];
    public openDetails: (param: GridDetailsParams) => void;
    public formatY: (param: GridDetailsParams) => void;
    public formatX: (param: GridDetailsParams) => void;
    public collection: any[] = [];

    public summ: Object;
    public hours: number = 0;
    public minutes: number = 0;
    public seconds: number = 0;

    constructor(
        private $state: ng.ui.IStateService,
        private $element: JQuery,
    ) {
        "ngInject";
        $element.addClass('iqs-statistics-grid-panel');

        if (!this.gridType || Object.values(iqs.shell.GridTypes).indexOf(this.gridType) == -1) {
            this.gridType = iqs.shell.GridTypes.Formated;
        }

        if (!this.nameLabel) {
            this.nameLabel = 'STATISTICS_GRID_NAME';
        }
    }

    private prepareDate(item, type: string) {
        switch (type) {
            case 'yearly': {
                item.x = item.month
                break;
            }
            case 'daily': {
                item.x = item.hour
                break;
            }
            case 'shift': {
                item.x = item.hour
                break;
            }
            case 'monthly': {
                item.x = item.day
                break;
            }
            case 'weekly': {
                let date = moment({ year: item.year, month: item.month - 1, day: item.day });
                item.x = date.weekday;
                break;
            }
        }
    }

    private dataChanged(data) {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        const mergedData = {};
        this.summ = {};
        for (const seria of data) {
            this.summ[seria.key] = 0;
            for (const val of seria.values) {
                if (!mergedData.hasOwnProperty(val.x)) {
                    mergedData[val.x] = {};
                }
                mergedData[val.x][seria.key] = val.value;
                this.summ[seria.key] += val.value;
            }
        }
        this.collection = map(mergedData, (v, x) => ({ x, ...v }));
    }

    public $onChanges(changes: StatisticsGridExPanelChanges): void {
        this.dataChanged(this.data)
    }

    public onDetails(item): void {
        if (this.openDetails) {
            this.openDetails({ item: item });
        }
    }

    public onFormatX(x) {
        if (this.formatX) {
            return this.formatX(x)
        } else {
            return x;
        }
    }

    public onFormatY(y) {
        if (this.formatY) {
            return this.formatY(y)
        } else {
            return y;
        }
    }
}

(() => {
    angular
        .module('iqsStatisticsGridExPanel', [])
        .component('iqsStatisticsGridExPanel', {
            bindings: StatisticsGridExPanelBindings,
            templateUrl: 'statistics/panels/StatisticsGridExPanel.html',
            controller: StatisticsGridExPanelController,
            controllerAs: '$ctrl'
        })
})();
