import s from 'sequelize'

const Sequelize = s.Sequelize

const { PGUSER, PGDATABASE, PGPASSWORD, PGHOST, PGPORT } = process.env

const sequelize = new Sequelize( PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: 'postgres',
})

const test = async () => {
    try {
        await sequelize.authenticate()
        console.log(" 📀 Connection to database has been established successfully");
    } catch (error) {
        console.log(" 🚫 Unable to connect to the database: ", error);
    }
}
test()

export default sequelize