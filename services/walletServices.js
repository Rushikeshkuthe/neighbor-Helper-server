const { getDatabase, ObjectId } = require('../_helpers/db')

async function getWalletByUserId(req) {

    try {

        const { userId } = req.params


        if (!ObjectId.isValid(userId)) {
            return {
                status: false,
                msg: "User not found"
            }
        }
        const wallet = await getDatabase().collection('wallet').findOne({
            userId: new ObjectId(userId)
        })

        const transaction = await getDatabase().collection('transaction').find({ walletId: wallet._id }).toArray()
        if (!wallet) {
            return {
                status: false,
                msg: "No wallet found"
            }
        }

        return {
            status: true,
            msg: 'Wallet fetched successfuly',
            data: {
                wallet,
                transaction
            }
        }
    } catch (error) {
        return {
            status: false,
            msg: error.message
        }
    }
}

async function makepayment(req, res) {
    try {

        const { taskId, acceptedUserId, requestedUserId, amount } = req.body
        const db = getDatabase()

        const requesterWal = await db.collection('wallet').findOne({ userId: new ObjectId(requestedUserId) })
        const accepterWal = await db.collection('wallet').findOne({ userId: new ObjectId(acceptedUserId) })

        if (!requesterWal) {
            console.log("requester wallet not found");
        }else if (!accepterWal) {
            console.log("accepter wallet not found");
        }

        const task = await db.collection('task').findOne({ _id: new ObjectId(taskId) })

        if (requesterWal.balance < amount) {
            return {
                status: false,
                msg: "Insufficient balance"
            }
        }

        await db.collection('wallet').updateOne(
            { userId: new ObjectId(requestedUserId) },
            {
                $inc: { balance: -amount },
                $push: {
                    transaction: {
                        taskTitle: task.title,
                        type: 'debit',
                        amount: amount,
                        date: new Date(),
                    }
                }

            }

        )

        await db.collection('wallet').updateOne(
            { userId: new ObjectId(acceptedUserId) },
            {
                $inc: { balance: amount },
                $push: {
                    transaction: {
                        taskTitle: task.title,
                        type: 'credit',
                        amount: amount,
                        date: new Date(),
                    }
                }
            })

            return{
                status:true,
                msg:"Payment Successfull"
            }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            msg: error.message
        }
    }
}

module.exports = { getWalletByUserId ,makepayment}