import { ISpeedTraceSaveService } from './ISpeedTraceSaveService';

class SpeedTraceSaveService implements ISpeedTraceSaveService {
    private _filterParams: any;
    private _objectId: string;
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

    public set objectId(objectId: string) {
        this._objectId = objectId;
    }

    public get objectId(): string {
        return this._objectId;
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
    angular.module('iqsSpeedTrace.SaveService', [])
        .service('iqsSpeedTraceSaveService', SpeedTraceSaveService);

}