import { BaseEntityWithUUID } from 'src/common/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';

// disini untuk detail autentikasi login aku dipisahkan karna aku ingin
// tetap table staff itu detail independen dan gak bercampur dengan informasi lainya
// agar table user tetap clean

@Entity()
export class Session extends BaseEntityWithUUID {
  @Column()
  staffId: string;

  @Column()
  accessToken: string;

  @Column()
  expiresAt: Date;

  @Column()
  lastLoginAt: Date;

  @ManyToOne(() => Staff, (staff) => staff.sessions)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
