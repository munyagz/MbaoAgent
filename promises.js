const db = require('./dbconf')


  let scheme_id = 1366
  let new_entry = 0
  let chapter_id = '0000'
  let surname = ''
  let gender = 'Male'
  let language = 'ENGLISH'
  let  whatHappened = ''
  let sql = ''
  let values = []

setInterval(() => {

sql = `SELECT * FROM contributions WHERE status = 0 limit ${process.env.RECORD_LIMIT}`;
mpesa_channel.promise().query(sql)
    .then(([data, fields])=>{

        console.log("Selected a batch of: " + data.length)

        data.forEach(item => {

            sql = "INSERT IGNORE INTO members (chapter_id,scheme_id,juakali_ref_no,surname,firstname,other_names,date_of_birth,gender,id_number,mobile_number,language,created,modified,new_entry) VALUES ?"
                values = [
                    [chapter_id,2,item.mpesa_acc,surname,item.mpesa_sender,item.mpesa_sender,item.date_created,gender,item.mpesa_acc,item.mpesa_msisdn,language,new Date().toISOString().slice(0, 19).replace('T', ' '),new Date().toISOString().slice(0, 19).replace('T', ' '),new_entry]
                ]

                juakali.promise().query(sql, [values])
                .then(result =>{
                    if(result.affectedRows == 1) {
                        whatHappened = 'Row Inserted'
                    }
                    else if(result.affectedRows == 0){
                        whatHappened = 'Row Skipped'
                    }
                    console.log(item.mpesa_code + ": Done with Members table  >> " + whatHappened + {result})

                    sql = "INSERT IGNORE INTO contributions (member_id,names,scheme_id,amount,details,contr_msisdn,new_entry,year,month) VALUES ?"
                        values = [
                            [item.mpesa_acc,item.mpesa_sender,scheme_id,item.mpesa_amt,item.mpesa_code,item.mpesa_msisdn,new_entry,new Date(item.date_created).getFullYear(),new Date(item.date_created).getMonth()]
                        ]

                        juakali.promise().query(sql, [values])
                            .then(res => {         
                                if(res.affectedRows == 1) {
                                    whatHappened = 'Row Inserted'
                                }
                                else if(res.affectedRows == 0){
                                    whatHappened = 'Row Skipped'
                                }
                                console.log(item.mpesa_code + ": Done with Contributions table >> " + whatHappened)
                                
                                sql = `UPDATE contributions SET status = 1 WHERE mpesa_code = ? `
                                mpesa_channel.promise().query(sql,[item.mpesa_code])
                                    .then(result  =>{                            
                                        console.log(item.mpesa_code +': ' + 'Updated Mpesa_Channel Status')
                                        
                                    })
                                    .catch(err => console.log(err))

                                    })
                            .catch(err => console.log(err.stack))

                })
                .catch(err => console.log(err))
                
            });
    })
    .catch(err => console.log(err)) 

    
}, process.env.WAIT_TIME)
