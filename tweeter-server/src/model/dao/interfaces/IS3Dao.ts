export interface IS3Dao {
    putImage(fileName: string, imageStringBase64: string): Promise<string>;
}