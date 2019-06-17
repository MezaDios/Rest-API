import { Request, Response } from 'express';

import pool from '../database';
import { isNull } from 'util';

class UserController {

    public async test(req: Request, res: Response) {
        await pool.query('SELECT * FROM debts', (err, rows, fields) => {
            res.json(rows);
        });

    }

    public async login(req: Request, res: Response) {

        await pool.query(`
            SELECT id, userType,CONCAT(name, " ", surname) as name
            FROM users 
            WHERE telephone = ? AND password = ?`
            , [req.body.telephone, req.body.password], (err, rows, fields) => {

                console.log(req.body)
                if (err) {
                    throw err;
                }
                if (rows.length == 0) {
                    res.json({
                        logged: false
                    });
                }
                else {

                    let admin: boolean;
                    if (rows[0].userType == 2) {
                        admin = false
                    } else {
                        admin = true
                    }
                    res.json({
                        logged: true,
                        admin: admin,
                        id: rows[0].id,
                        name: rows[0].name
                    })
                }
            });


    }

    public async SignUp(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO users SET ?', [req.body], (err, rows, fields) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'User created.'
            });
        });
    }

    public async registerPayment(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO payments (id_debt, id_user, amount, paymentDate) VALUES (?,?,?,?)',
            [req.body.id_debt, req.body.id_user, req.body.amount, req.body.paymentDate],
            (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.json({
                    message: 'Payment registered.'
                });
            });
    }

    public async registerDebt(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO debts (concept, amount, creationDate) VALUES(?,?,?)',
            [req.body.concept, req.body.amount, req.body.creationDate],
            (err, rows, fields) => {
                if (err) {
                    throw err;
                }

                console.log(req.body);

                if (req.body.users.length == 0) {
                    pool.query('DELETE FROM debts WHERE id_debt = ?', [rows.insertId], (err, row, fields) => {
                        res.json({
                            message: 'Debt not registered. Empty users.'
                        });
                    })
                }
                else {
                    req.body.users.forEach((user: any) => {
                        if (!isNull(user)) {
                            pool.query('INSERT INTO debtDetails (id_debt, debtor) VALUES (?,?)',
                                [rows.insertId, user], (err, rows, fields) => {
                                    if (err) {
                                        throw err;
                                    }

                                });
                        }
                    });
                    res.json({
                        message: 'Debt registered.'
                    });
                }

            });
    }

    public async getDebtsByDate(req: Request, res: Response): Promise<void> {
        await pool.query(`SELECT debts.*, CONCAT(users.name, " ", users.surname) as name, users.telephone 
        FROM debts JOIN 
        debtDetails ON debtDetails.id_debt = debts.id 
        JOIN users ON debtDetails.debtor = users.id
        WHERE debts.creationDate >= ? AND debts.creationDate <= ?`,
            [req.body.startDate, req.body.endDate], (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.json(rows);
            });
    }

    public async getDebtsByUser(req: Request, res: Response): Promise<void> {
        await pool.query(`SELECT debts.*, CONCAT(users.name, " ", users.surname) as name, users.telephone 
        FROM debts JOIN 
        debtDetails ON debtDetails.id_debt = debts.id 
        JOIN users ON debtDetails.debtor = users.id 
        WHERE debtDetails.debtor = ?`,
            [req.params.id], (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.json(rows);
            });
    }

    public async getTotalDue(req: Request, res: Response): Promise<void> {
        await pool.query('SELECT getTotalDue(?) as due', [req.params.id], (err, rows, fields) => {
            if (err) {
                throw err;
            }

            res.json(rows);
        })
    }

    public async getGeneralDue(req: Request, res: Response): Promise<void> {
        await pool.query('SELECT getGeneralDue()', (err, rows, fields) => {
            if (err) {
                throw err;
            }

            res.json(rows);
        });
    }

    public async getPaymentsByUser(req: Request, res: Response): Promise<void> {
        await pool.query('SELECT * FROM payments WHERE id_user = ?', [req.params.id],
            (err, rows, fields) => {
                if (err) {
                    throw err;
                }

                res.json(rows);
            })
    }

    public async getDebtors(req: Request, res: Response): Promise<void> {
        await pool.query('SELECT id, telephone , CONCAT(name, " ", surname) as name FROM users WHERE userType = 2',
            (err, rows, fields) => {

                if (err) {
                    throw err;
                }

                res.json(rows);

            })
    }

}

export const userController = new UserController();