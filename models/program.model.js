const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema(
    {
        s_id: String, // School ID
        name: String,
        department: String,
    },
    { 
        collection: 'Programs',
        toObject: { virtuals: true }, 
        toJSON: { virtuals: true } 
    }
);

// Virtual field to reference the associated school
ProgramSchema.virtual('school', {
    ref: 'School',
    localField: 's_id',
    foreignField: 'id',
    justOne: true
});

// Pre-save hook to ensure no duplicate program names exist under the same school
ProgramSchema.pre('save', async function (next) {
    try {
        // Check if another program with the same name already exists under the same school
        const existingProgram = await mongoose.model('Program').findOne({ s_id: this.s_id, name: this.name });

        if (existingProgram) {
            return next(new Error(`${this.name}" already exists under school.`));
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Pre-update hook to ensure no duplicate program names exist under the same school when updating
ProgramSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        // Only perform check if the update includes name and s_id
        if (update.name && update.s_id) {
            const query = this.getQuery();
            const existingProgram = await mongoose.model('Program').findOne({
                s_id: update.s_id,
                name: update.name,
                _id: { $ne: query._id } // Exclude the document being updated
            });
            if (existingProgram) {
                return next(new Error(`${update.name} already exists under school.`));
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Program', ProgramSchema);