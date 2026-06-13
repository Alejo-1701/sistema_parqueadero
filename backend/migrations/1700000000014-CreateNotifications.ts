import { MigrationInterface, QueryRunner, Table, TableIndex, TableCheck, TableForeignKey } from 'typeorm';

export class CreateNotifications1700000000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
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
            name: 'notification_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'recipient_person_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'sender_account_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'sent_at',
            type: 'timestamptz',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'read_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'unread'",
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '20',
            default: "'normal'",
            isNullable: false,
          },
          {
            name: 'channel',
            type: 'varchar',
            length: '20',
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
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_tenant_status_date',
        columnNames: ['tenant_id', 'status', 'sent_at'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_tenant_recipient',
        columnNames: ['tenant_id', 'recipient_person_id'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_tenant_type',
        columnNames: ['tenant_id', 'notification_type'],
      }),
    );

    // Check constraints
    await queryRunner.createCheckConstraints('notifications', [
      new TableCheck({
        name: 'CHK_notifications_type',
        expression: "notification_type IN ('entry','exit','payment','security','maintenance','general')",
      }),
      new TableCheck({
        name: 'CHK_notifications_status',
        expression: "status IN ('unread','read','archived')",
      }),
      new TableCheck({
        name: 'CHK_notifications_priority',
        expression: "priority IN ('low','normal','high','urgent')",
      }),
    ]);

    // Foreign keys
    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['recipient_person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'people',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['sender_account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
