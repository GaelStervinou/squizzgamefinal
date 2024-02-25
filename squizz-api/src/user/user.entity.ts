import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Quizz } from '../quizz/quizz.entity';
import { Room } from '../room/room.entity';
import { RoomStudent } from '../room/roomStudent.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Unique(['username'])
    username: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToMany(type => Quizz, quizz => quizz.author)
    quizzs: Quizz[];

    @OneToMany(type => Room, room => room.owner)
    rooms: Room[];

    @OneToMany(type => RoomStudent, room => room.student)
    studentRooms: Room[];
}