import {User} from "../user/user.entity";
import {DataSourceOptions} from "typeorm";
import { Quizz } from '../quizz/quizz.entity';
import { Question } from '../quizz/question.entity';
import { Answer } from '../quizz/answer.entity';
import { Room } from '../room/room.entity';
import { RoomStudent } from '../room/roomStudent.entity';
import { StudentAnswer } from '../quizz/studentAnswer.entity';

require('dotenv').config();

class ConfigService {

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): DataSourceOptions {
        return {
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),
            entities: [User, Quizz, Question, Answer, Room, RoomStudent, StudentAnswer],
            migrationsTableName: 'migration',
            migrations: ['src/migrations/*.ts'],
            ssl: false,
            synchronize: false,
        } as DataSourceOptions;
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE'
    ]);

export { configService };