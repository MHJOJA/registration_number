module.exports = function registration(pool) {

  async function insertRegNumbers(regNumber) {
    var regNumber = regNumber.toUpperCase();
   
    var town = regNumber.substring(0, 2);
    console.log(regNumber)
    console.log( town)
      var townsId = await pool.query(
        'select id from town where start_string = $1 ',[town]);
        
        var theId = townsId.rows[0].id;

      
      var text = 'INSERT INTO registration_numbers(numberplates,town_id) VALUES ($1,$2)'
      var values = [regNumber, theId]
      await pool.query(text, values)

      return true;
   
  }

  const duplicates = async (number) => {
    // var regNumber = regNumber.toUpperCase();

    var regCount = await pool.query('select numberplates from registration_numbers where numberplates = $1',[number])
       return  regCount.rowCount 
  }

    

    
    

  async function filter(id) {
    if (id == "All") {
      const all = await pool.query(
        "select numberplates from registration_numbers"
      );
      return all.rows;
    } else {
      const theTown = await pool.query(
        "select numberplates from registration_numbers where town_id = $1",
        [parseInt(id)]
      );
      return theTown.rows;
    }
  }

 
  
 
  
  async function getRegNumbers() {
    const viewTown = await pool.query(
      "select numberplates from registration_numbers"
    );
    // console.log({viewTown});
    return viewTown.rows;
  }

  async function reset() {
    await pool.query("delete from registration_numbers");
   }




 


  return {
    insertRegNumbers,
    getRegNumbers,
    reset,
    duplicates,
     filter
    
    

  }

}
