class GridDetailsParams {
    public item: any;
}

interface IStatisticsGridPanelBindings {
    [key: string]: any;

    data: any;
    statType: any;
    gridType: any;
    dateType: any;
    openDetails: any;
    formatY: any;
    formatX: any;
    nameLabel: any;
    valueLabel: any;
}

const StatisticsGridPanelBindings: IStatisticsGridPanelBindings = {
    data: '<?iqsGridData',
    statType: '=?iqsStatType',
    gridType: '=?iqsGridType',
    dateType: '=?iqsGridType',
    openDetails: '&iqsOpenDetails',
    formatY: '=?iqsFormatGridY',
    formatX: '=?iqsFormatGridX',
    nameLabel: '=?iqsNameLabel',
    valueLabel: '=?iqsValueLabel',
}

class StatisticsGridPanelChanges implements ng.IOnChangesObject, IStatisticsGridPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    data: ng.IChangesObject<any>;
    statType: ng.IChangesObject<string>;
    gridType: ng.IChangesObject<string>;
    dateType: ng.IChangesObject<string>;
    openDetails: ng.IChangesObject<() => ng.IPromise<void>>;
    formatY: ng.IChangesObject<() => ng.IPromise<void>>;
    formatX: ng.IChangesObject<() => ng.IPromise<void>>;
    nameLabel: ng.IChangesObject<string>;
    valueLabel: ng.IChangesObject<string>;
}

class StatisticsGridPanelController implements IStatisticsGridPanelBindings {
    public data: any;
    public statType: string;
    public gridType: string;
    public dateType: string;
    public nameLabel: string;
    public valueLabel: string;
    public openDetails: (param: GridDetailsParams) => void;
    public formatY: (param: GridDetailsParams) => void;
    public formatX: (param: GridDetailsParams) => void;
    public collection: any[] = [];

    public summ: number = 0;
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
        if (!this.nameLabel) {
            this.nameLabel = 'STATISTICS_GRID_VALUE'
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
        this.summ = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        if (this.gridType == iqs.shell.GridTypes.Time) {
            if (!angular.isObject(data[0].display)) {
                this.collection = _.filter(data, (item: any) => {
                    return item.value != 0;
                });
                _.each(this.collection, (item: any) => {
                    item.display = {};
                    let v = Math.floor(item.value);
                    item.display.hours = Math.floor(v / 3600)
                    item.display.minutes = Math.floor((v - item.display.hours * 3600) / 60);
                    item.display.seconds = (v - item.display.hours * 3600 - item.display.minutes * 60);
                    if (this.dateType) {
                        this.prepareDate(item, this.dateType);
                    }
                });
            }
            this.collection = _.filter(data, (item: any) => {
                return item.display && (item.display.hours != 0 || item.display.minutes != 0 || item.display.seconds != 0);
            });

            _.each(this.collection, (item: any) => {
                this.hours += Number(item.display.hours);
                this.minutes += Number(item.display.minutes);
                this.seconds += Number(item.display.seconds);
            });

            let minutes: number = Math.floor(this.seconds / 60);
            this.seconds = this.seconds % 60;
            this.minutes += minutes;
            let hours: number = Math.floor(this.minutes / 60);
            this.minutes = this.minutes % 60;
            this.hours += hours;
        } else {
            this.collection = _.filter(data, (item: any) => {
                return item.value != 0;
            });

            _.each(this.collection, (item: any) => {
                this.summ += item.value;
            });
        }
    }

    public $onChanges(changes: StatisticsGridPanelChanges): void {
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
        .module('iqsStatisticsGridPanel', [])
        .component('iqsStatisticsGridPanel', {
            bindings: StatisticsGridPanelBindings,
            templateUrl: 'statistics/panels/StatisticsGridPanel.html',
            controller: StatisticsGridPanelController,
            controllerAs: '$ctrl'
        })
})();
