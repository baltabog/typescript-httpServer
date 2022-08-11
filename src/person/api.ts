import { Express } from 'express';
import { AbstractCrudApi } from '../abstract/abstractCrudApi';
import PersonDao from './dao';
import Person from './entity';
import { Genre } from './genre';

export default class CSVPersonApi extends AbstractCrudApi<Person, PersonDao> {

    constructor(public server: Express) {
        super(server, new PersonDao());
    }

    getBasePath(): string {
        return "/csv/persons"
    }

    mapToEntity(map: any): Person {
        return new Person(map.id, map.firstName, map.secoundName, Genre.getGenreFromString(map.genre));
    }
}
