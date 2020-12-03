const assert = require('assert')
let RegNumbers = require('../regNumbers');
const pg = require('pg');

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_registrations';
const pool = new Pool({
    connectionString
})
const regNumbers = RegNumbers(pool);
describe("The registration numbers webapp", function () {
    beforeEach(async function () {
      await pool.query("delete from registration_numbers;");
    });
  
    it("should be able to insert registration numbers", async function () {
      await regNumbers.insertRegNumbers('CY 321 456');
  
      const getRegNumber = await regNumbers.getRegNumbers();
      assert.deepEqual(
        [
          {
            numberplates: 'CY 321 456',
          },
        ],
        getRegNumber
      );
    });

  
    
it('should be able to reset the database ', async function () {
        await regNumbers.insertRegNumbers("CA 321-541");
        await regNumbers.insertRegNumbers("Cy 785 214");
        await regNumbers.insertRegNumbers("CA 321");
        
		await regNumbers.reset()

		const results = await pool.query("select count (*) from registration_numbers");

		await assert.deepEqual(0, results.rows[0].count)
  })
  
//   it('should be able to add registration numbers from different towns',async function(){
//     await regNumbers.insertRegNumbers('CA 132 654')
//     await regNumbers.insertRegNumbers('CL 789-325')

//     const results = await regNumbers.insertRegNumbers()
// 		await assert.deepEqual([{numberplates: 'CA 132 654'},{numberplates: 'CL 789325'}], results)

//   })


// it("should be able to show if its from Bellville", async function () {
//   await regNumbers.insertRegNumbers("CA 369-985");
//   await regNumbers.insertRegNumbers("CL 458 475");
//   await regNumbers.insertRegNumbers("CY 639 158");

//   assert.equal(await regNumbers.filter(1), [
//     { numberplates: "CY 639 158" },
//   ]);
// });

  })







