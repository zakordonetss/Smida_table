import { readFile } from "fs";
import { resolve } from "path";


export class InfoHistoryService {
    private readonly _infoHistoryFilePath = resolve(__dirname, '../data/', 'history.json');
    private _history: IPublication[];

    public get history() {
        return [...this._history];
    }

    public async setHistoryInfo(): Promise<void> {
        await readFile(this._infoHistoryFilePath, 'utf-8', (err, cont) => {
            if (err) throw new Error("Error reading file");
            else this._setHistory(cont);
        });
    }

    private _setHistory(file: string): void {
        this._history = JSON.parse(file) as IPublication[];
    }
};

export interface IPublication {
    publicationType: string,
    termType: string,
    reportGroup: string,
    reportState: string,
    reportFormat: string,
    outputDate: {
        date: Date,
    },
    outputNumber: number,
}