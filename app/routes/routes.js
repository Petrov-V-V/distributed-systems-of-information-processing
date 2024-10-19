const { ObjectId } = require("mongodb");

// Oprations with MongoDB repo
module.exports = function (app, db) {
    // Remove note
    app.delete('/notes/remove/:id', async (req, res) => {
        const noteId = req.params.id;

        try {
            const result = await db.collection("notes").deleteOne({
                _id: ObjectId.createFromHexString(noteId)
            });

            if (result.deletedCount !== 0) {
                res.send({
                    message: "Success",
                });
            } else {
                res.status(404).send({ error: "Note's not found" });
            }
        } catch (err) {
            console.error("Error on delete: ", err);
            res.status(500).send({
                error: "Error on delete"
            });
        }
    });

    // Update note
    app.patch('/notes/update/:id', async (req, res) => {
        const noteId = req.params.id;
        const note = { ...req.body };

        try {
            const result = await db.collection('notes').updateOne(
                { _id: ObjectId.createFromHexString(noteId) },
                { $set: note }
            );

            if (result.matchedCount !== 0) {
                console.log("Note", note);
                res.send({
                    id: noteId, ...note
                });
            } else {
                res.status(404).send({ error: "Note's not found" });
            }
        } catch (err) {
            console.log('Error on update: ', err);
            res.status(500).send({
                error: 'Error on update'
            });
        }
    });

    // Create note
    app.post('/notes/add', async (req, res) => {
        const note = { ...req.body };

        try {
            const result = await db.collection('notes').insertOne(note);
            console.log('NOTE', note)
            res.send({ ...result, ...note });
        } catch (err) {
            console.log('Error on create: ', err)
            res.status(500).send({
                'error': 'Error on create'
            });
        }
    });

    // Get all notes 
    app.get('/notes/all', async (req, res) => {
        try {
            const result = await db.collection('notes').find({}).toArray();
            console.log('result:', result)
            res.send(result);
        } catch (err) {
            console.log('Error on get all: ', err)
            res.status(500).send({
                'error': 'Error on get all'
            });
        }
    });

}
