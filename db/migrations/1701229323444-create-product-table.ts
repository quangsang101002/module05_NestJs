// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class CreateProductTable1701229323444 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE ra_module_05.users CHANGE COLUMN user_email email VARCHAR(255)',
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE ra_module_05.users CHANGE COLUMN email user_email VARCHAR(255)',
//     );
//   }
// }

// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class CreateProductTable1701089035760 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Logic tạo
//     await queryRunner.createTable(
//       new Table({
//         name: 'products',
//         columns: [
//           {
//             name: 'id',
//             type: 'int',
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: 'increment',
//           },
//           {
//             name: 'name',
//             type: 'varchar',
//             length: '200',
//             isNullable: false,
//           },
//           {
//             name: 'unit_price',
//             type: 'decimal',
//             length: '10, 2',
//             isNullable: false,
//           },
//         ],
//       }),
//       true,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Logic xóa
//     await queryRunner.query('DROP TABLE products');
//   }
// }
