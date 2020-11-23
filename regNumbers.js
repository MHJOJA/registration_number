module.exports = function registration(pool) {

  async function insertRegNumbers(regNumber) {
    var regNumber = regNumber.toUpperCase();
    var town = regNumber.substring(0, 2);

    console.log(regNumber)
    console.log('reg_number file', town)

    
    try {
      var text = 'INSERT INTO registration_numbers(numberplates,town_code) VALUES ($1,$2)'
      var values = [regNumber, town]
      await pool.query(text, values)

      return true;
      

    } catch (error) {
      console.log('this is an error ',error)
      return false
    }

    

  }
 
  
 
  
  async function getRegNumbers() {
    const viewTown = await pool.query(
      "select numberplates from registration_numbers"
    );
    console.log({viewTown});
    return viewTown.rows;
  }

  async function reset() {
    await pool.query("delete from registration_numbers");
   }




 


  return {
    insertRegNumbers,
    getRegNumbers,
    reset,
    
    

  }

}
