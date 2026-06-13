import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateRequests1700000000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'requests',
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
            name: 'request_type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'requester_person_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'responder_person_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'response',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requested_at',
            type: 'timestamptz',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'responded_at',
            type: 'timestamptz',
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

    // Index on (tenant_id, status, requested_at DESC) — listado cronológico por status
    await queryRunner.createIndex(
      'requests',
      new TableIndex({
        name: 'IDX_requests_tenant_status_date',
        columnNames: ['tenant_id', 'status', 'requested_at'],
      }),
    );

    // Index on (tenant_id, requester_person_id) — búsqueda por solicitante
    await queryRunner.createIndex(
      'requests',
      new TableIndex({
        name: 'IDX_requests_tenant_requester',
        columnNames: ['tenant_id', 'requester_person_id'],
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('requests', [
      new TableCheck({
        name: 'CHK_requests_type',
        expression: "request_type IN ('access','visit','service','complaint','claim')",
      }),
      new TableCheck({
        name: 'CHK_requests_status',
        expression: "status IN ('pending','approved','rejected','in_progress')",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'requests',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'requests',
      new TableForeignKey({
        columnNames: ['requester_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'requests',
      new TableForeignKey({
        columnNames: ['responder_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('requests');
  }
}
