import { parse } from 'csv-parse';
import { AbstractEntity } from "./abstractEntity";

export interface Dao<E extends AbstractEntity> {
    getAll(): E[]

    getById(id: string): E

    add(entity: E): boolean

    update(entity: E): boolean

    delete(entity: E): boolean
}

export abstract class CVSEntitiesDao<E extends AbstractEntity> implements Dao<E> {
    private entities: E[] = []

    constructor() {
        const fs = require('fs');
        const fileContent = fs.readFileSync(this.getCsvFilePath(), { encoding: 'utf-8' });
      
        parse(fileContent, { delimiter: ',', columns: this.getCsvHeaders()}, 
            (error, result: E[]) => {
                if (error) {
                    console.error(error);
                }
            
                console.log(this.getCsvFilePath() + " elements:", result);
                this.entities = result.splice(1, result.length);
            });
    }
        
    getAll(): E[] {
        return this.entities
    }

    getById(id: string): E {
        return this.entities.filter(entity => entity.id === id)[0];
    }

    add(entity: E): boolean {
        var beforeActionLength = this.entities.length;
        var clonedEntitiesArr = this.getEntitiesArrClone();
        var afterActionLength = clonedEntitiesArr.push(entity);
        this.doAfterEntitiesChange(clonedEntitiesArr);
        
        return beforeActionLength < afterActionLength
    }

    update(entity: E): boolean {
        var beforeActionLength = this.entities.length;
        var clonedEntitiesArr = this.getEntitiesArrClone();
        clonedEntitiesArr = clonedEntitiesArr.map(arrEntity => arrEntity.id !== entity.id ? arrEntity : entity);
        var afterActionLength = clonedEntitiesArr.length;
        this.doAfterEntitiesChange(clonedEntitiesArr);

        return beforeActionLength < afterActionLength;
    }

    delete(entity: E): boolean {
        var idx = -1;
        for (var i=0; i<this.entities.length; ++i) {
            if (entity.id == this.entities[i].id) {
                idx = i;
                break;
            }
        }

        if (idx > -1) {
            const clonedEntitiesArr = this.getEntitiesArrClone();
            clonedEntitiesArr.splice(idx, 1);
            this.doAfterEntitiesChange(clonedEntitiesArr);
            return true;
        }

        return false;
    }

    protected abstract getCsvFilePath(): string
    protected abstract getCsvHeaders(): string[]

    private doAfterEntitiesChange(newEntitiesArr: E[]): void {
        const { convertArrayToCSV } = require('convert-array-to-csv');
        const fs = require('fs');
        fs.writeFile(this.getCsvFilePath(), convertArrayToCSV(newEntitiesArr), function(err: string) {
            if (err) {
                return console.error(err);
            }
            console.log("CSV updated");
        });
        // remove all from entities
        this.entities.splice(0, this.entities.length);
        // add all array elements to entities
        newEntitiesArr.forEach(val => this.entities.push(Object.assign({}, val)));
    }

    private getEntitiesArrClone(): E[] {
        const myClonedArray: E[] = [];
        this.entities.forEach (val => myClonedArray.push(val));

        return myClonedArray;
    }
}
