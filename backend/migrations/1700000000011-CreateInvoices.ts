import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateInvoices1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
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
            name: 'issued_at',
            type: 'timestamptz',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'discount_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'tax_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'parking_lot_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'person_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'visitor_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'paid_at',
            type: 'timestamptz',
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
      'invoices',
      new TableIndex({
        name: 'IDX_invoices_tenant_issued',
        columnNames: ['tenant_id', 'issued_at'],
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_invoices_tenant_status',
        columnNames: ['tenant_id', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_invoices_tenant_person',
        columnNames: ['tenant_id', 'person_id'],
      }),
    );

    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'IDX_invoices_tenant_visitor',
        columnNames: ['tenant_id', 'visitor_id'],
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('invoices', [
      new TableCheck({
        name: 'CHK_invoices_status',
        expression: "status IN ('pending','paid','cancelled','overdue')",
      }),
      new TableCheck({
        name: 'CHK_invoices_payment_method',
        expression: "payment_method IS NULL OR payment_method IN ('cash','card','bank_transfer','nequi','daviplata')",
      }),
      new TableCheck({
        name: 'CHK_invoices_exclusive_entity',
        expression: "(person_id IS NOT NULL AND visitor_id IS NULL) OR (person_id IS NULL AND visitor_id IS NOT NULL) OR (person_id IS NULL AND visitor_id IS NULL)",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['parking_lot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'parking_lots',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['visitor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'visitors',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}
