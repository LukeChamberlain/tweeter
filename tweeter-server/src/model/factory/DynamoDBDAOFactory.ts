import { DAOFactory } from "./DAOFactory";
import { IUserDao } from "../dao/interfaces/IUserDao";
import { IAuthTokenDao } from "../dao/interfaces/IAuthTokenDao";
import { IFollowDao } from "../dao/interfaces/IFollowDao";
import { IStatusDao } from "../dao/interfaces/IStatusDao";
import { IS3Dao } from "../dao/interfaces/IS3Dao";
import { DynamoDBUserDao } from "../dao/dynamodb/DynamoDBUserDao";
import { DynamoDBAuthTokenDao } from "../dao/dynamodb/DynamoDBAuthTokenDao";
import { DynamoDBFollowDao } from "../dao/dynamodb/DynamoDBFollowDao";
import { DynamoDBStatusDao } from "../dao/dynamodb/DynamoDBStatusDao";
import { S3Dao } from "../dao/dynamodb/DynamoDBS3Dao";

export class DynamoDBDAOFactory implements DAOFactory {
    getUserDao(): IUserDao {
        return new DynamoDBUserDao();
    }

    getAuthTokenDao(): IAuthTokenDao {
        return new DynamoDBAuthTokenDao();
    }

    getFollowDao(): IFollowDao {
        return new DynamoDBFollowDao();
    }

    getStatusDao(): IStatusDao {
        return new DynamoDBStatusDao();
    }

    getS3Dao(): IS3Dao {
        return new S3Dao();
    }
}