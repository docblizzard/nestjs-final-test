import { ConfigService } from '@nestjs/config';
import {
    DatabaseConfiguration,
    DATABASE_NAME,
    DATABASE_PORT,
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASSWORD,
} from './model/database-configuration';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Task } from '../../task/task.entity';

@Injectable()
export class ConfigurationService {
    private _databaseConfig: DatabaseConfiguration;
    
    get databaseConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: parseInt(this.configService.get<string>('DATABASE_PORT'), 10),
            username: this.configService.get<string>('DATABASE_USER'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [User, Task],
            synchronize: true,
        };
    }
    private set databaseConfig(value: DatabaseConfiguration) {
        this._databaseConfig = value;
    }

    constructor(private configService: ConfigService) {
        this.setupEnvironment();
    }
    
    private setupEnvironment(): void {
        const databasePort = this.getVariableFromEnvFile(DATABASE_PORT);
        const databaseName = this.getVariableFromEnvFile(DATABASE_NAME);
        const databaseHost = this.getVariableFromEnvFile(DATABASE_HOST);
        const databaseUser = this.getVariableFromEnvFile(DATABASE_USER);
        const databasePassword = this.getVariableFromEnvFile(DATABASE_PASSWORD);
        this._databaseConfig = {
            DATABASE_NAME: databaseName,
            DATABASE_PORT: databasePort,
            DATABASE_HOST: databaseHost,
            DATABASE_USER: databaseUser,
            DATABASE_PASSWORD: databasePassword,
        };
    }

    private getVariableFromEnvFile(key: string): string {
        const variable = this.configService.get<string>(key);
        if (!variable) {
            throw new Error('No database port could be found from env file.');
        }
        return variable;
    }
}
