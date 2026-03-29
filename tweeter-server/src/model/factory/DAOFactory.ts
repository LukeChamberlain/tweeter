import { IUserDao } from "../dao/interfaces/IUserDao";
import { IAuthTokenDao } from "../dao/interfaces/IAuthTokenDao";
import { IFollowDao } from "../dao/interfaces/IFollowDao";
import { IStatusDao } from "../dao/interfaces/IStatusDao";
import { IS3Dao } from "../dao/interfaces/IS3Dao";

export interface DAOFactory {
    getUserDao(): IUserDao;
    getAuthTokenDao(): IAuthTokenDao;
    getFollowDao(): IFollowDao;
    getStatusDao(): IStatusDao;
    getS3Dao(): IS3Dao;
}