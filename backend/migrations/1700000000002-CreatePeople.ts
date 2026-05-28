import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreatePeople1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'people',
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
          },
          {
            name: 'document_type',
            type: 'enum',
            enum: ['CC', 'CE', 'TI', 'PP', 'NIT'],
          },
          {
            name: 'document_number',
            type: 'varchar',
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'suspended'],
            default: "'active'",
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

    // Create unique indexes
    await queryRunner.createIndex(
      'people',
      new TableIndex({
        name: 'UQ_people_tenant_document_number',
        columnNames: ['tenant_id', 'document_number'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'people',
      new TableIndex({
        name: 'UQ_people_tenant_email',
        columnNames: ['tenant_id', 'email'],
        isUnique: true,
      }),
    );

    // Create check constraints
    await queryRunner.createCheckConstraints(
      'people',
      [
        new TableCheck({
          name: 'CHK_people_document_type',
          expression: "document_type IN ('CC', 'CE', 'TI', 'PP', 'NIT')",
        }),
        new TableCheck({
          name: 'CHK_people_status',
          expression: "status IN ('active', 'inactive', 'suspended')",
        }),
      ],
    );

    // Create foreign key to tenants
    await queryRunner.createForeignKey(
      'people',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('people');
  }
}
