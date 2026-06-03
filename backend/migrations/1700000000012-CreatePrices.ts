import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreatePrices1700000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prices',
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
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'billing_unit',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            default: 1,
            isNullable: false,
          },
          {
            name: 'invoice_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'rate_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'valid_from',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'valid_to',
            type: 'date',
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

    // Indexes
    await queryRunner.createIndex(
      'prices',
      new TableIndex({
        name: 'IDX_prices_tenant_invoice',
        columnNames: ['tenant_id', 'invoice_id'],
      }),
    );

    await queryRunner.createIndex(
      'prices',
      new TableIndex({
        name: 'IDX_prices_tenant_rate',
        columnNames: ['tenant_id', 'rate_id'],
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('prices', [
      new TableCheck({
        name: 'CHK_prices_billing_unit',
        expression: "billing_unit IN ('hour','day','week','month','event','fraction')",
      }),
      new TableCheck({
        name: 'CHK_prices_status',
        expression: "status IN ('active','inactive')",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        columnNames: ['invoice_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'invoices',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        columnNames: ['rate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rates',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prices');
  }
}
