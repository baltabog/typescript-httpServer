import { Express, Request, Response } from 'express';
import { Dao } from './abstractDao';
import { AbstractEntity } from './abstractEntity';

export abstract class AbstractCrudApi<E extends AbstractEntity, D extends Dao<E>> {

    constructor(public server: Express, public dao: D) {
        
        // generic API to get all entities 
        this.server.get(this.getBasePath(), (req, res) => {
            if (req.url != this.getBasePath()) {
                this.sendResponse(req, res, 404)
                return
            }
            
            this.sendResponse(req, res, 200, this.dao.getAll())
        })

        // generic API to get entity by id 
        this.server.get(this.getBasePath() + '/:id', (req, res) => {
            var id = req.params.id

            if (req.url != this.getBasePath() + "/" + id) {
                this.sendResponse(req, res, 404)
                return
            }

            var entity = this.dao.getById(id);
            if (!entity) {
                this.sendResponse(req, res, 204)
                return
            }

            this.sendResponse(req, res, 200, entity)
        })

        // generic API to create an entity
        this.server.post(this.getBasePath(), (req, res) => {
            if (req.url != this.getBasePath()) {
                this.sendResponse(req, res, 404)
                return
            }

            const entityReceipt: E = this.mapToEntity(req.body)
            if (this.dao.getById(entityReceipt.id)) {
                this.sendResponse(req, res, 405)
                return
            }

            this.dao.add(entityReceipt);

            this.sendResponse(req, res, 201, entityReceipt)
        })

        // generic API to update an entity (all fields, except id will be replaced with received values)
        this.server.put(this.getBasePath(), (req, res) => {
            if (req.url != this.getBasePath()) {
                this.sendResponse(req, res, 404)
                return
            }

            const entityReceipt: E = this.mapToEntity(req.body)
            if (!this.dao.getById(entityReceipt.id)) {
                this.sendResponse(req, res, 405)
                return
            } 

            this.dao.update(entityReceipt);

            this.sendResponse(req, res, 200, entityReceipt)
        })

        // generic API to delete an entity by id
        this.server.delete(this.getBasePath() + '/:id', (req, res) => {
            var id = req.params.id

            if (req.url != this.getBasePath() + "/" + id) {
                this.sendResponse(req, res, 404)
                return
            }

            this.dao.delete(this.dao.getById(id));

            this.sendResponse(req, res, 202)
        })
    }
    
    abstract getBasePath(): string

    abstract mapToEntity(map: any): E

    private sendResponse(req: Request<any, any, any, any>, res: Response, statusCode: number, body?: any) {
        if (body) {
            res.status(statusCode)
                .contentType("application/json")
                .send(JSON.stringify(body))
        } else {
            res
                .sendStatus(statusCode)
        }

        console.log(req.method + ":" + req.url + " --> " + statusCode);
    }

    

}