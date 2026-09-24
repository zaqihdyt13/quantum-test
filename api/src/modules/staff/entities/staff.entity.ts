import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntityWithUUID } from '../../../common/base.entity';
import { hashPassword } from '../../../helpers/password.helpers';
import { Exclude } from 'class-transformer';
import { Session } from '../../auth/entities/session.entity';
import { Attendance } from 'src/modules/attendance/entities/attendance.entity';

@Entity()
export class Staff extends BaseEntityWithUUID {
  @Column({ unique: true })
  staffId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @OneToMany(() => Session, (session) => session.staff)
  sessions: Session[];

  @Column({ unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashUserPassword() {
    if (this.passwordHash) {
      this.passwordHash = await hashPassword(this.passwordHash);
    }
  }

  @OneToMany(() => Attendance, (attendance) => attendance.staff)
  attendances: Attendance[];
}
