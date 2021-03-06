// const { Pool, Client } = require('pg');
const Promise = require('bluebird');

const initOptions = {
  connect(client) {
    const cp = client.connectionParameters;
    console.log('Connected to database:', cp.database);
  }
};

// const conn = {
//   user: 'jenn',
//   host: 'localhost',
//   database: 'robinhood',
//   password: '',
//   port: 5432
// };

const conn = {
    user: 'other_user',
    host: 'ec2-54-153-49-106.us-west-1.compute.amazonaws.com',
    database: 'robinhood',
    password: 'jennthh',
    port: 5432
  };

const pgp = require('pg-promise')(initOptions);
const db = pgp(conn);

const companyColSet = new pgp.helpers.ColumnSet(
  ['companyabbriev','company','stockspurchased','yearhigh','yearlow','yearavg','currentprice'], 
  {table: `stockprices`});

const distributionColSet = new pgp.helpers.ColumnSet(
  ['id','divindex','divaverage','divstockspurchased'], 
  {table: 'stockdistribution'});

function getCompany(companyAbbriev) {
  let queryString = `SELECT * FROM stockprices INNER JOIN stockdistribution 
    ON stockprices.distributionid = stockdistribution.id 
    WHERE stockprices.companyabbriev = \'${companyAbbriev}\'`;
  return db.result(queryString);
}

function addCompany(companyEntry, distributionEntries) {
  let { companyabbriev, company, stockspurchased, 
    yearhigh, yearlow, yearavg, currentprice } = companyEntry;
  let queryString = `INSERT INTO stockprices (companyabbriev, company, stockspurchased, 
    yearhigh, yearlow, yearavg, currentprice, distributionid) 
    VALUES ('${companyabbriev}', '${company}', ${stockspurchased}, 
    ${yearhigh}, ${yearlow}, ${yearavg}, ${currentprice}, DEFAULT) RETURNING distributionid;`;
    return ( 
      db.one(queryString)
        .then(result => {
            console.log(`DistId: ${result.distributionid}`);
            console.log(`${companyEntry.companyabbriev} inserted`);
            let distributionEntriesWithId = distributionEntries.map(div => { 
              return {...div, id: result.distributionid}; 
            })
            let distributionInsert = pgp.helpers.insert(distributionEntriesWithId, distributionColSet);
            return db.none(distributionInsert)
          })
        .catch((err) => { 
          console.log('Error inserting company');
          reject(err); }))   
}

function updateCompany(companyEntry, distributionEntries) {
  let companyUpdate = pgp.helpers.update(companyEntry, ['company', 
    'stockspurchased','yearhigh', 'yearlow', 'yearavg', 'currentprice'], 'stockprices') + 
    `WHERE companyabbriev = '${companyEntry.companyabbriev}' RETURNING distributionid`;
  return(
    db.one(companyUpdate)
      .then(result => {
        console.log(`DistId: ${result.distributionid}`);
        console.log(`${companyEntry.companyabbriev} updated`);
        let distributionUpdate = pgp.helpers.update(distributionEntries, 
          ['?divindex', 'divaverage', 'divstockspurchased'], 'stockdistribution') + 
          `WHERE v.divindex = t.divindex AND t.id = ${result.distributionid}`; 
        return db.none(distributionUpdate);
      })
      .catch(err => reject(err))
  )
}

function deleteCompany(companyAbbriev, callback) {
  let queryString = `SELECT distributionid FROM stockprices 
    WHERE companyabbriev = \'${companyAbbriev}\';`;
    return(
      db.one(queryString)
        .then(result => {
          db.none(deleteQueryString('stockprices', 'companyabbriev', companyAbbriev))
            .then(() => {
              return db.none(deleteQueryString('stockdistribution', 'id', result.distributionid));
            })
            .catch((err) => reject(err))
        })
        .catch((err) => reject(err))
    )
}

function deleteQueryString(tableName, propertyName, property) {
  return `DELETE FROM ${tableName} WHERE ${propertyName} = ${(typeof property === 'string' ? `\'${property}\'` : property)};`;
}

module.exports = { getCompany, addCompany, updateCompany, deleteCompany };


// db.query("CREATE TABLE ---")
//   .then(res => {
//     console.log(res);
//     console.timeEnd('PGseed');
//   })
//   .catch(err => {
//     console.log(err);
//   });
    // .finally(pgp.end);

// const pool = new Pool({
//   user: 'jenn',
//   host: 'localhost',
//   database: 'robinhood',
//   password: '',
//   port: 5432,
// })

// pool.query("CREATE TABLE ---", (err, res) => {
//   if (err) { console.log(err); }
//   console.log(res);
//   pool.end();
// });