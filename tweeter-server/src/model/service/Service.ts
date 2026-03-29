import { DAOFactory } from "../factory/DAOFactory";
import { DynamoDBDAOFactory } from "../factory/DynamoDBDAOFactory";

export class Service {
    protected factory: DAOFactory;

    public constructor(factory: DAOFactory = new DynamoDBDAOFactory()) {
        this.factory = factory;
    }
}