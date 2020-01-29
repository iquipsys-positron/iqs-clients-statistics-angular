import { IObjectParamsSaveService } from './IObjectParamsSaveService';

class ObjectParamsSaveService implements IObjectParamsSaveService {
    private _filterParams: any;
    private _paramId: string;
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

    public set paramId(objectId: string) {
        this._paramId = objectId;
    }

    public get paramId(): string {
        return this._paramId;
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
    angular.module('iqsObjectParams.SaveService', [])
        .service('iqsObjectParamsSaveService', ObjectParamsSaveService);

}