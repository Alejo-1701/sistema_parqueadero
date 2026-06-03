import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateResidents1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'residents',
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
            name: 'resident_code',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'resident_type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'person_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'apartment_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'move_in_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'move_out_date',
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

    // Unique index: (tenant_id, resident_code)
    await queryRunner.createIndex(
      'residents',
      new TableIndex({
        name: 'UQ_residents_tenant_code',
        columnNames: ['tenant_id', 'resident_code'],
        isUnique: true,
      }),
    );

    // Indexes for common queries
    await queryRunner.createIndex(
      'residents',
      new TableIndex({
        name: 'IDX_residents_tenant_person',
        columnNames: ['tenant_id', 'person_id'],
      }),
    );

    await queryRunner.createIndex(
      'residents',
      new TableIndex({
        name: 'IDX_residents_tenant_apartment',
        columnNames: ['tenant_id', 'apartment_id'],
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints(
      'residents',
      [
        new TableCheck({
          name: 'CHK_residents_type',
          expression: "resident_type IN ('resident','tenant')",
        }),
        new TableCheck({
          name: 'CHK_residents_status',
          expression: "status IN ('active','inactive')",
        }),
      ],
    );

    // Foreign keys
    await queryRunner.createForeignKey(
      'residents',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'residents',
      new TableForeignKey({
        columnNames: ['person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'residents',
      new TableForeignKey({
        columnNames: ['apartment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'apartments',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('residents');
  }
}
