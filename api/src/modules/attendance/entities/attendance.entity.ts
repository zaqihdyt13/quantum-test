import { BaseEntityWithUUID } from 'src/common/base.entity';
import { Staff } from 'src/modules/staff/entities/staff.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Attendance extends BaseEntityWithUUID {
  @Column({ unique: true })
  attendanceId: string;

  @Column()
  staffId: string;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => Staff, (staff) => staff.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
