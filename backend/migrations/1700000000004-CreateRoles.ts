import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateRoles1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.createTable(
      new Table({
        name: 'roles',
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
            name: 'code',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
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

    // Create unique index for roles
    await queryRunner.createIndex(
      'roles',
      new TableIndex({
        name: 'UQ_roles_tenant_code',
        columnNames: ['tenant_id', 'code'],
        isUnique: true,
      }),
    );

    // Create check constraint for roles.code (tenant roles only, no SUPERADMIN)
    await queryRunner.createCheckConstraints(
      'roles',
      [
        new TableCheck({
          name: 'CHK_roles_code',
          expression: "code IN ('ADMIN', 'OPERATOR', 'GUARD', 'RESIDENT', 'OWNER', 'LESSEE', 'VISITOR')",
        }),
      ],
    );

    // Create foreign key to tenants
    await queryRunner.createForeignKey(
      'roles',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'CASCADE',
      }),
    );

    // Create account_roles table
    await queryRunner.createTable(
      new Table({
        name: 'account_roles',
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
            name: 'account_id',
            type: 'uuid',
          },
          {
            name: 'role_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create unique index for account_roles
    await queryRunner.createIndex(
      'account_roles',
      new TableIndex({
        name: 'UQ_account_roles_tenant_account_role',
        columnNames: ['tenant_id', 'account_id', 'role_id'],
        isUnique: true,
      }),
    );

    // Create foreign key to tenants
    await queryRunner.createForeignKey(
      'account_roles',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key to accounts
    await queryRunner.createForeignKey(
      'account_roles',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key to roles
    await queryRunner.createForeignKey(
      'account_roles',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account_roles');
    await queryRunner.dropTable('roles');
  }
}
