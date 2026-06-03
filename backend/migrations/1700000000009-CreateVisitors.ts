import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateVisitors1700000000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'visitors',
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
            name: 'visit_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'vehicle_type',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'person_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'vehicle_plate',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'visiting_apartment_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'authorized_by_person_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'check_in_at',
            type: 'timestamptz',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'check_out_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'active'",
            isNullable: false,
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

    // Index on (tenant_id, check_in_at DESC) — listado cronológico
    await queryRunner.createIndex(
      'visitors',
      new TableIndex({
        name: 'IDX_visitors_tenant_checkin',
        columnNames: ['tenant_id', 'check_in_at'],
      }),
    );

    // Index on (tenant_id, vehicle_plate) — búsqueda por placa
    await queryRunner.createIndex(
      'visitors',
      new TableIndex({
        name: 'IDX_visitors_tenant_plate',
        columnNames: ['tenant_id', 'vehicle_plate'],
      }),
    );

    // Index on (tenant_id, visiting_apartment_id) — visitantes por apto
    await queryRunner.createIndex(
      'visitors',
      new TableIndex({
        name: 'IDX_visitors_tenant_apartment',
        columnNames: ['tenant_id', 'visiting_apartment_id'],
      }),
    );

    // Partial index for active visitors query
    await queryRunner.createIndex(
      'visitors',
      new TableIndex({
        name: 'IDX_visitors_active',
        columnNames: ['tenant_id', 'status', 'check_in_at'],
        where: "status = 'active'",
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('visitors', [
      new TableCheck({
        name: 'CHK_visitors_visit_type',
        expression: "visit_type IN ('frequent','occasional','service','emergency')",
      }),
      new TableCheck({
        name: 'CHK_visitors_vehicle_type',
        expression: "vehicle_type IS NULL OR vehicle_type IN ('car','motorcycle','bicycle','none')",
      }),
      new TableCheck({
        name: 'CHK_visitors_status',
        expression: "status IN ('active','inactive','expired')",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'visitors',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'visitors',
      new TableForeignKey({
        columnNames: ['person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'visitors',
      new TableForeignKey({
        columnNames: ['visiting_apartment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'apartments',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'visitors',
      new TableForeignKey({
        columnNames: ['authorized_by_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('visitors');
  }
}
