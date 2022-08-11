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
        var beforeActionLength = this.entities.length
        var afterActionLength = this.entities.push(entity)
        this.doAfterEntitiesChange()
        
        return beforeActionLength < afterActionLength
    }

    update(entity: E): boolean {
        var beforeActionLength = this.entities.length
        this.entities = this.entities.map(u => u.id !== entity.id ? u : entity)
        var afterActionLength = this.entities.length
        this.doAfterEntitiesChange()

        return beforeActionLength < afterActionLength
    }

    delete(entity: E): boolean {
        var idx = -1
        for (var i=0; i<this.entities.length; ++i) {
            if (entity.id == this.entities[i].id) {
                idx = i
                break
            }
        }

        if (idx > -1) {
            this.entities.splice(idx, 1)
            this.doAfterEntitiesChange()
            return true
        }

        return false
    }

    private  doAfterEntitiesChange(): void {
        const { convertArrayToCSV } = require('convert-array-to-csv');
        const fs = require('fs');
        fs.writeFile(this.getCsvFilePath(), convertArrayToCSV(this.entities), function(err: string) {
            if (err) {
                return console.error(err);
            }
            console.log("CSV updated");
        });
    }

    protected abstract getCsvFilePath(): string
    protected abstract getCsvHeaders(): string[]
}
