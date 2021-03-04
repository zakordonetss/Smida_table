import { readFile, writeFile } from "fs";
import { resolve } from "path";


export class InfoHistoryService {
    private readonly _infoHistoryFilePath = resolve(__dirname, '../data/', 'history.json');
    private _history: IPublication[];

    public get history() {
        return [...this._history];
    }

    public async setHistory(): Promise<void> {
        await readFile(this._infoHistoryFilePath, 'utf-8', (err, cont) => {
            if (err) throw new Error("Error reading file");
            else this._history = JSON.parse(cont);
        });
    }

    public deleteHistoryById(idReport: string): boolean {
        try {  
            const index = this.history.findIndex((item) => item.idReport === +idReport);
            if (index === -1) throw new Error("Invalid idReport");
            this._history.splice(index, 1);

            writeFile(this._infoHistoryFilePath, JSON.stringify(this._history), (err) => {
                if (err) throw new Error("Error during writting file");
            });

            return true;
        } catch (err) {
            if (err instanceof Error) throw err;
			else throw new Error('Error during deletion.');
        }
    }

    public filterHistory({
        publicationType,
        termType,
        reportGroup,
        reportState,
        reportFormat,
        outputDateStart,
        outputDateEnd,
        outputNumber
    }: IFilter = {}): IPublication[] {
        let result = this.history;

        if (publicationType) {
            result = result.filter((item) => item.publicationType === publicationType);
        }

        if (termType) {
            result = result.filter((item) => item.termType === termType);
        }

        if (reportGroup) {
            result = result.filter((item) => item.reportGroup === reportGroup);
        }

        if (reportState) {
            result = result.filter((item) => item.reportState === reportState);
        }

        if (reportFormat) {
            result = result.filter((item) => item.reportFormat === reportFormat);
        }

        if (outputDateStart) {
            result = result.filter((item) => {
                return Date.parse(item.outputDate.date) >= Date.parse(outputDateStart);
            });
        }

        if (outputDateEnd) {
            result = result.filter((item) => {
                return Date.parse(item.outputDate.date) <= Date.parse(outputDateEnd);
            });
        }

        if (outputNumber) {
            result = result.filter((item) => item.outputNumber === +outputNumber);
        }

        return result;
    }
};

export interface IPublication {
    idReport: number;
    publicationType: string;
    termType: string;
    reportGroup: string;
    reportState: string;
    reportFormat: string;
    outputDate: {
        date: string;
    },
    outputNumber: number;
}

export interface IFilter {
    publicationType?: string;
    termType?: string;
    reportGroup?: string;
    reportState?: string;
    reportFormat?: string;
    outputDateStart?: string;
    outputDateEnd?: string;
    outputNumber?: number | string;
}