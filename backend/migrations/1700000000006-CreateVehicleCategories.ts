import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateVehicleCategories1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicle_categories',
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
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'service_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'base_rate',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'fraction_minutes',
            type: 'integer',
            default: 60,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'active'",
            isNullable: false,
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

    // Unique index: (tenant_id, name)
    await queryRunner.createIndex(
      'vehicle_categories',
      new TableIndex({
        name: 'UQ_vehicle_categories_tenant_name',
        columnNames: ['tenant_id', 'name'],
        isUnique: true,
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints(
      'vehicle_categories',
      [
        new TableCheck({
          name: 'CHK_vehicle_categories_service_type',
          expression: "service_type IN ('private','public','cargo','official','emergency')",
        }),
        new TableCheck({
          name: 'CHK_vehicle_categories_status',
          expression: "status IN ('active','inactive')",
        }),
      ],
    );

    // Foreign key to tenants
    await queryRunner.createForeignKey(
      'vehicle_categories',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicle_categories');
  }
}
