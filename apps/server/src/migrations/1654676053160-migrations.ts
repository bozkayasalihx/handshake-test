// //@ts-ignore
// import { faker } from "@faker-js/faker";
// import bcrypt from "bcryptjs";
// import dayjs from "dayjs";
// import { MigrationInterface, QueryRunner } from "typeorm";
// import { UserTypes } from "../types/types";

// type ReturnType = { obj: Record<string, any>; tableName: string };

// function* countGen() {
//     let count = 0;
//     while (true) yield ++count;
// }

// export class migrations1654676053160 implements MigrationInterface {
//     private randomIndex() {
//         const values = Object.values(UserTypes);
//         const index = Math.floor(Math.random() * values.length);
//         return values[index];
//     }

//     private hash() {
//         const str = "google";
//         return bcrypt.hash(str, +process.env.SALT);
//     }

//     private genKeys(obj: Record<string, any>) {
//         let str = "(";
//         const keys = Object.keys(obj);
//         for (let i = 0; i < keys.length; i++) {
//             if (i == keys.length - 1) str += `${keys[i]}`;
//             else str += `${keys[i]},`;
//         }
//         str += ")";

//         return str;
//     }

//     private genValues(obj: Record<string, any>) {
//         let str = "(";
//         const values = Object.values(obj);
//         for (let j = 0; j < values.length; j++) {
//             if (j == values.length - 1) str += `'${values[j]}'`;
//             else str += `'${values[j]}',`;
//         }
//         str += ")";
//         return str;
//     }

//     public randomise(min: number, max: number, length: number) {
//         const randomValue = () =>
//             Math.floor(Math.random() * (max - min + 1) + min);
//         // eslint-disable-next-line no-constant-condition
//         // while (true) {
//         //     hashSet.add(randomValue());
//         //     if (hashSet.size >= length) break;
//         // }
//         // const [firstOne] = Array.from(hashSet).splice(0, 1);
//         // hashSet.delete(firstOne);
//         // return firstOne;
//     }

//     private;

//     private async runner(
//         queryRunner: QueryRunner,
//         callback: () => ReturnType | Promise<ReturnType>
//     ) {
//         for (let i = 1; i < 101; i++) {
//             try {
//                 const { obj, tableName } = await callback();
//                 const obj1 = this.genKeys(obj);
//                 const obj2 = this.genValues(obj);
//                 await queryRunner.query(
//                     `INSERT INTO ${tableName} ${obj1} VALUES ${obj2}`
//                 );
//             } catch (err) {
//                 continue;
//             }
//         }
//     }

//     private async specificUserInsert(queryRunner: QueryRunner) {
//         const specificUser = {
//             username: "google",
//             email: "google@google.com",
//             password: await this.hash(),
//             user_type: "SA",
//             tckn: BigInt(faker.random.numeric(11)),
//             mobile: faker.random.numeric(10),
//             start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//             end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//         };

//         const userColumns = this.genKeys(specificUser);
//         const userValues = this.genValues(specificUser);
//         await queryRunner.query(
//             `INSERT INTO users ${userColumns} VALUES ${userValues}`
//         );
//     }

//     private async randomInt() {
//         const randInt = faker.datatype.number({ min: 1, max: 100 });
//     }

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         // await this.specificUserInsert(queryRunner);
//         this.runner(queryRunner, async () => {
//             const randomUserType = this.randomIndex();
//             const userObj = {
//                 username: faker.name.firstName(),
//                 email: faker.internet.email(),
//                 password: await this.hash(),
//                 user_type: randomUserType,
//                 tckn: BigInt(faker.random.numeric(11)),
//                 mobile: faker.random.numeric(10),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//             };
//             return {
//                 obj: userObj,
//                 tableName: "users",
//             };
//         });
//         this.runner(queryRunner, async () => {
//             const vendorObj = {
//                 name: faker.company.companyName(),
//                 tax_no: faker.random.alpha(20),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 attribute1: faker.lorem.slug(),
//                 updated_by: 1,
//                 created_by: 1,
//             };
//             return {
//                 obj: vendorObj,
//                 tableName: "vendors",
//             };
//         });
//         this.runner(queryRunner, async () => {
//             const vendorRegionObj = {
//                 name: faker.company.companyName(),
//                 attribute1: faker.lorem.slug(),
//                 vendor_id: faker.datatype.number({ min: 1, max: 100 }),
//                 created_by: 1,
//                 updated_by: 1,
//             };
//             return {
//                 obj: vendorRegionObj,
//                 tableName: "vendor_regions",
//             };
//         });
//         this.runner(queryRunner, () => {
//             const dealerObj = {
//                 name: faker.company.companyName(),
//                 tax_no: faker.random.alpha(20),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//             };
//             return {
//                 obj: dealerObj,
//                 tableName: "dealers",
//             };
//         });

//         this.runner(queryRunner, async () => {
//             const dalerSiteObj = {
//                 name: faker.company.companyName(),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//                 dealer_id: faker.datatype.number({ min: 1, max: 100 }),
//             };
//             return {
//                 obj: dalerSiteObj,
//                 tableName: "dealer_sites",
//             };
//         });
//         this.runner(queryRunner, () => {
//             const buyerObj = {
//                 name: faker.name.firstName(),
//                 tax_no: faker.random.alpha(20),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//             };
//             return {
//                 obj: buyerObj,
//                 tableName: "buyers",
//             };
//         });
//         this.runner(queryRunner, async () => {
//             const buyerSiteObj = {
//                 name: faker.name.firstName(),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//                 buyer_id: faker.datatype.number({ min: 1, max: 100 }),
//             };
//             return {
//                 obj: buyerSiteObj,
//                 tableName: "buyer_sites",
//             };
//         });

//         this.runner(queryRunner, async () => {
//             const userEntity = {
//                 user_id: faker.datatype.number({ min: 1, max: 100 }),
//                 description: faker.lorem.sentence(4),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//                 ...this.randomField(),
//             };
//             return {
//                 obj: userEntity,
//                 tableName: "user_entity_relations",
//             };
//         });
//         this.runner(queryRunner, () => {
//             const ids = this.randomIds(["vendor_id", "dealer_site_id"]);
//             const vdsObj = {
//                 description: faker.lorem.sentence(4),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//                 ...ids,
//             };

//             return {
//                 obj: vdsObj,
//                 tableName: "vds_relations",
//             };
//         });
//         this.runner(queryRunner, () => {
//             const ids = this.randomIds(["buyer_site_id", "vds_rltn_id"]);
//             const vdsbs = {
//                 description: faker.lorem.sentence(4),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//                 ...ids,
//             };

//             return {
//                 obj: vdsbs,
//                 tableName: "vdsbs_relations",
//             };
//         });
//         this.runner(queryRunner, () => {
//             const ids = this.randomIds(["vdsbs_id", "user_id"]);
//             const dealerRouteUsers = {
//                 description: faker.lorem.sentence(4),
//                 start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
//                 end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
//                 created_by: 1,
//                 updated_by: 1,
//                 ...ids,
//             };

//             return {
//                 obj: dealerRouteUsers,
//                 tableName: "dealer_route_users",
//             };
//         });
//     }

//     private randomIds(ids: string[]) {
//         const obj = {};
//         for (let i = 0; i < ids.length; i++)
//             obj[ids[i]] = faker.datatype.number({ min: 1, max: 100 });
//         return obj;
//     }

//     private randomField() {
//         const fields = [
//             "vendor_table_ref_id",
//             "buyer_site_table_ref_id",
//             "dealer_site_table_ref_id",
//         ];
//         const index = Math.floor(Math.random() * fields.length);
//         return { [fields[index]]: faker.datatype.number({ min: 1, max: 100 }) };
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         //
//     }
// }
export {};
