import fs from 'fs';
import path from 'path';

class FileManager {
    folderPath: string;
    filePath: string;
    folderName: string;
    fileName: string;
    file: string;

    constructor(folderName: string, fileName: string) {
        this.folderName = folderName;
        this.fileName = fileName;
        this.file = `${fileName}.json`;
        this.folderPath = path.join(__dirname, '..', this.folderName);
        this.filePath = path.join(this.folderPath, this.file);
    }

    folderExists(){
        return fs.existsSync(this.folderPath);
    }

    createFolder(){
        if(!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath, { recursive: true });
        }
    }

    fileExists(){
        return fs.existsSync(this.filePath);
    }

    createEmptyFile(){
        fs.writeFileSync(this.filePath, JSON.stringify([]));
    }

    initializeFile(){
        if(!this.folderExists()){
            this.createFolder();
        }

        if(!this.fileExists()){
            this.createEmptyFile();
        }
    }

    getFileAsJson(){
        const fileData = fs.readFileSync(this.filePath).toString();
        return JSON.parse(fileData);
    }
}

export default FileManager;