const getNextId = (json: any): number => {
    const id = json.id;

    if(json.id == undefined) {
        return 0;
    }

    return id + 1;
}

export default getNextId;