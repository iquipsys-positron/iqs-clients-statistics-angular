import { IObjectEventsSaveService } from './IObjectEventsSaveService';

class ObjectEventsSaveService implements IObjectEventsSaveService {
    private _filterParams: any;
    private _eventId: string;
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

    public set eventId(eventId: string) {
        this._eventId = eventId;
    }

    public get eventId(): string {
        return this._eventId;
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
    angular.module('iqsObjectEvents.SaveService', [])
        .service('iqsObjectEventsSaveService', ObjectEventsSaveService);

}