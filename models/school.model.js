const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        unique: true
    },
    location: {
        type: String,
        default: ''
    }
}, { collection: 'Schools' });

// Pre-save hook to generate the ID if not provided
SchoolSchema.pre('save', async function (next) {
try {
    if (!this.id) {
        const lastSchool = await mongoose.model('School').findOne({}, {}, { sort: { id: -1 } });

        let newId = '001'; // Default for first entry
        if (lastSchool && lastSchool.id) {
            const lastIdNum = parseInt(lastSchool.id, 10);
            newId = String(lastIdNum + 1).padStart(3, '0');
        }
        this.id = newId; // Assign new ID
    }

    next();
} catch (error) {
    next(error);
}
});

module.exports = mongoose.model('School', SchoolSchema);