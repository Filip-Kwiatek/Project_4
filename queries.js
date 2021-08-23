const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "schedules",
  password: "123",
  port: 5432,
});

pool.on("connect", () => {
  console.log("Database connection");
});

// const getSchedules = (_, response) => {
//   pool.query(
//     "SELECT * FROM public.schedules ORDER BY id ASC",
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).json(results.rows);
//     }
//   );
// };

// const createSchedule = (request, response) => {
//   const { id, user_id, day, timeStart, timeEnd } = request.body;
//   pool.query(
//     "INSERT INTO schedules (id, user_id, day, timeStart, timeEnd) VALUES ($1, $2, $3, $4, $5)"
//   ),
//     [id, user_id, day, timeStart, timeEnd],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(201).send("User added to database");
//     };
// };

// module.exports = {
//   getSchedules,
//   createSchedule,
// };

module.exports = pool;
