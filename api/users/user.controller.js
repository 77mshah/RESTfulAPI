const { create, getUserById, getUsers, updateUser, deleteUser, getUserByEmail } = require("./user.service");
const fs = require("fs");

const { genSaltSync, hashSync, compareSync } = require("bcrypt")
const { sign } = require("jsonwebtoken");
let privateKey = fs.readFileSync("./private.key", "utf-8");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        console.log("Body is: ", req.body);
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                })
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                });
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    updateUsers: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: 'Updated successfully'
            })
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            return res.json({
                success: 1,
                message: "User deleted successfully"
            })
        })
    },
    login: (req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if(!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if(result) {
                results.password = undefined;
                const jwt = sign({results}, privateKey, {
                    expiresIn: "1h",
                    algorithm: "RS256"
                });
                return res.json({
                    success: 1,
                    message: "Login successfully",
                    token: jwt
                })
            }
        })
    }
}