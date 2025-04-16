const getNextId = (json: any[]): number => {
    try {
        if (!Array.isArray(json) || json.length === 0) {
            return 0;
        }

        const lastItem = json[json.length - 1];

        if (!lastItem || typeof lastItem.id !== 'number') {
            return 0;
        }

        return lastItem.id + 1;
    } catch {
        return 0;
    }
};

export default getNextId;