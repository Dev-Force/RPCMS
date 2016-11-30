export class Operation {

    public _id: string;
    public name: string;
    public description: string;
    public positionalNumOfParams: number;
    public namedParams: string[] = [];
    public externalUrl: string;
    public requestMethod: string;
    public tokenKey: string;
    public tokenValue: string;
    public tokenInHeaders: boolean;
    public tokenInParams: boolean;

}