import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreatePqrs1700000000015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pqrs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tenant_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'pqr_type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'requester_person_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'assigned_person_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'registered_at',
            type: 'timestamptz',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'responded_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'open'",
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '20',
            default: "'normal'",
            isNullable: false,
          },
          {
            name: 'response',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'satisfaction_score',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex(
      'pqrs',
      new TableIndex({
        name: 'IDX_pqrs_tenant_status_date',
        columnNames: ['tenant_id', 'status', 'registered_at'],
      }),
    );

    await queryRunner.createIndex(
      'pqrs',
      new TableIndex({
        name: 'IDX_pqrs_tenant_requester',
        columnNames: ['tenant_id', 'requester_person_id'],
      }),
    );

    await queryRunner.createIndex(
      'pqrs',
      new TableIndex({
        name: 'IDX_pqrs_tenant_type',
        columnNames: ['tenant_id', 'pqr_type'],
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('pqrs', [
      new TableCheck({
        name: 'CHK_pqrs_type',
        expression: "pqr_type IN ('petition','complaint','claim','suggestion','congratulation')",
      }),
      new TableCheck({
        name: 'CHK_pqrs_status',
        expression: "status IN ('open','in_progress','resolved','closed','rejected')",
      }),
      new TableCheck({
        name: 'CHK_pqrs_priority',
        expression: "priority IN ('low','normal','high','urgent')",
      }),
      new TableCheck({
        name: 'CHK_pqrs_score',
        expression: "satisfaction_score IS NULL OR (satisfaction_score >= 1 AND satisfaction_score <= 5)",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'pqrs',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'pqrs',
      new TableForeignKey({
        columnNames: ['requester_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'pqrs',
      new TableForeignKey({
        columnNames: ['assigned_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pqrs');
  }
}
