import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateAccounts1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
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
            name: 'person_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password_hash',
            type: 'varchar',
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'failed_login_attempts',
            type: 'int',
            default: 0,
          },
          {
            name: 'locked_until',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'blocked'],
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
      'accounts',
      new TableIndex({
        name: 'UQ_accounts_tenant_username',
        columnNames: ['tenant_id', 'username'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'accounts',
      new TableIndex({
        name: 'UQ_accounts_tenant_email',
        columnNames: ['tenant_id', 'email'],
        isUnique: true,
      }),
    );

    // Create check constraints
    await queryRunner.createCheckConstraints(
      'accounts',
      [
        new TableCheck({
          name: 'CHK_accounts_status',
          expression: "status IN ('active', 'inactive', 'blocked')",
        }),
      ],
    );

    // Create foreign key to tenants
    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key to people (optional)
    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts');
  }
}
