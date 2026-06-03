import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateRates1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rates',
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
            name: 'rate_type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'min_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'max_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'fraction_minutes',
            type: 'int',
            default: 60,
            isNullable: false,
          },
          {
            name: 'valid_from',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'valid_to',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'vehicle_category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'parking_lot_id',
            type: 'uuid',
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

    // Unique index: (tenant_id, vehicle_category_id, parking_lot_id, rate_type, valid_from)
    await queryRunner.createIndex(
      'rates',
      new TableIndex({
        name: 'UQ_rates_tenant_category_lot_type_date',
        columnNames: ['tenant_id', 'vehicle_category_id', 'parking_lot_id', 'rate_type', 'valid_from'],
        isUnique: true,
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('rates', [
      new TableCheck({
        name: 'CHK_rates_type',
        expression: "rate_type IN ('standard','preferential','night','weekend','holiday')",
      }),
      new TableCheck({
        name: 'CHK_rates_status',
        expression: "status IN ('active','inactive')",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'rates',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'rates',
      new TableForeignKey({
        columnNames: ['vehicle_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle_categories',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'rates',
      new TableForeignKey({
        columnNames: ['parking_lot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'parking_lots',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rates');
  }
}
