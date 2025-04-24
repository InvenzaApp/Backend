export class DateTime {
    static getDate(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        return `${day}.${month}.${year}`;
    }

    static getTime(): string {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    static getFullTimestamp(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        const microseconds = `${milliseconds}000`;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
    }

    static getDateTimestamp(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        const microseconds = `${milliseconds}000`;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
    }
}