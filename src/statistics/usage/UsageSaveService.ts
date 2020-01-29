import { IUsageSaveService } from './IUsageSaveService';

class UsageSaveService implements IUsageSaveService {
    private _filterParams: any;
    private _deviceId: string;
    private _details: boolean;
    private _view: string;

    constructor(

    ) {
        "ngInject";
    }

    public set filterParams(value: any) {
        this._filterParams = value;
    }

    public get filterParams(): any {
        return this._filterParams;
    }

    public set deviceId(deviceId: string) {
        this._deviceId = deviceId;
    }

    public get deviceId(): string {
        return this._deviceId;
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
    angular.module('iqsUsage.SaveService', [])
        .service('iqsUsageSaveService', UsageSaveService);
}