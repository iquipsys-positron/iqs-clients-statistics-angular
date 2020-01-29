import { IPresenceSaveService } from './IPresenceSaveService';

class PresenceSaveService implements IPresenceSaveService {
    private _filterParams: any;
    private _zoneId: string;
    private _details: boolean;
    private _view: string;

    constructor(
 
    ) {
        "ngInject";

         this._view = iqs.shell.StatisticsView.Chart;
    }

    public set filterParams(value: any) {
        this._filterParams = value;
    }

    public get filterParams(): any {
        return this._filterParams;
    }

    public set zoneId(objectId: string) {
        this._zoneId = objectId;
    }

    public get zoneId(): string {
        return this._zoneId;
    }

    public set details(details: boolean) {
        this._details = details;
    }

    public get details(): boolean {
        return this._details;
    }

    public set view(view: string) {
        this._view = view;
    }

    public get view(): string {
        return this._view;
    }
    
}

{
    angular.module('iqsPresence.SaveService', [])
        .service('iqsPresenceSaveService', PresenceSaveService);
}