import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateParkingLots1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parking_lots',
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
            name: 'capacity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
            isNullable: false,
          },
          {
            name: 'vehicle_category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'parking_type',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'opens_at',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'closes_at',
            type: 'time',
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

    // Check constraints
    await queryRunner.createCheckConstraints(
      'parking_lots',
      [
        new TableCheck({
          name: 'CHK_parking_lots_status',
          expression: "status IN ('available','full','maintenance','closed')",
        }),
        new TableCheck({
          name: 'CHK_parking_lots_type',
          expression: "parking_type IN ('visitors','residents','mixed','emergency')",
        }),
      ],
    );

    // Foreign key to tenants
    await queryRunner.createForeignKey(
      'parking_lots',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    // Foreign key to vehicle_categories
    await queryRunner.createForeignKey(
      'parking_lots',
      new TableForeignKey({
        columnNames: ['vehicle_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle_categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('parking_lots');
  }
}
