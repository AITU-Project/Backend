import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Approval } from './approval.entity';
import { Called } from './called.entity';
import { Defender } from './defender.entity';
import { Incident } from './incident.entity';

@Entity()
export class Conclusion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  registrationDate: string;

  @Column()
  position: string;

  @Column()
  region: string;

  @Column()
  plannedActions: string;

  @Column({ type: 'date' })
  eventDate: string;

  @Column()
  eventPlace: string;

  @Column()
  investigator: string;

  @Column()
  status: string;

  @Column()
  eventRelation: string;

  @Column()
  investigationType: string;

  @Column()
  isBusinessRelated: boolean;

  @Column()
  justification: string;

  @Column()
  actionResult: string;

  @Column()
  createdBy: string;

  @OneToMany(() => Approval, (approval) => approval.conclusion)
  approvals: Approval[];

  @OneToMany(() => Called, (called) => called.conclusion)
  called: Called[];

  @OneToMany(() => Incident, (incident) => incident.conclusion)
  incident: Incident[];

  @OneToMany(() => Defender, (defender) => defender.conclusion)
  defender: Defender[];
}
