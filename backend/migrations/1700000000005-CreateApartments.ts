import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateApartments1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'apartments',
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
            name: 'tower',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'apartment_number',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'owner_person_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'area_m2',
            type: 'decimal',
            precision: 8,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'bedrooms',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'bathrooms',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'apartment_type',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
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

    // Unique index: (tenant_id, tower, apartment_number)
    await queryRunner.createIndex(
      'apartments',
      new TableIndex({
        name: 'UQ_apartments_tenant_tower_number',
        columnNames: ['tenant_id', 'tower', 'apartment_number'],
        isUnique: true,
      }),
    );

    // Check constraint for apartment_type
    await queryRunner.createCheckConstraints(
      'apartments',
      [
        new TableCheck({
          name: 'CHK_apartments_type',
          expression: "apartment_type IN ('studio','1_bed','2_bed','3_bed','penthouse')",
        }),
        new TableCheck({
          name: 'CHK_apartments_status',
          expression: "status IN ('available','occupied','maintenance','for_sale')",
        }),
      ],
    );

    // Foreign key to tenants
    await queryRunner.createForeignKey(
      'apartments',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    // Foreign key to people (owner)
    await queryRunner.createForeignKey(
      'apartments',
      new TableForeignKey({
        columnNames: ['owner_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('apartments');
  }
}
