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

            this._writeHistory(this._history);

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

    public postHistory({
        publicationType,
        termType,
        reportGroup,
        reportState,
        reportFormat,
        date,
        outputNumber,
    }: IPostPublication): boolean {
        try {
            if (!publicationType ||
                !termType ||
                !reportGroup ||
                !reportState ||
                !reportFormat ||
                !date ||
                !outputNumber) {
                    throw new Error("Invalid history data");
                }
            
            const maxIdReport = Math.max(...this._history.map((item) => item.idReport));

            const newPost: IPublication = {
                idReport: maxIdReport + 1,
                publicationType: publicationType,
                termType: termType,
                reportGroup: reportGroup,
                reportState: reportState,
                reportFormat: reportFormat,
                outputDate: {
                    date: date,
                },
                outputNumber: outputNumber,
            }

            this._history.push(newPost);
            this._writeHistory(this._history);
            return true;

        } catch (err) {
            if (err instanceof Error) throw err;
			else throw new Error('Error during posting.');
        }
    }

    private _writeHistory(obj: IPublication[]): void {
        writeFile(this._infoHistoryFilePath, JSON.stringify(obj), (err) => {
                if (err) throw new Error("Error during writing file");
        });
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

export interface IPostPublication {
    publicationType?: string;
    termType?: string;
    reportGroup?: string;
    reportState?: string;
    reportFormat?: string;
    date?: string;
    outputNumber?: number;
}