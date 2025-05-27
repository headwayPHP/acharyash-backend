const mongoose = require('mongoose');
const moment = require('moment');

const kathaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    start_date: { type: String, required: true }, // Format: YYYY/MM/DD
    end_date: { type: String, required: true },   // Format: YYYY/MM/DD
    time: { type: String },
    location: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'In Process', 'Done', 'Cancelled']
    },
    createdAt: { type: Date, default: Date.now }
});

// Determine status from date logic
function determineStatus(startDateStr, endDateStr) {
    const today = moment().startOf('day');
    const start = moment(startDateStr, 'YYYY-MM-DD').startOf('day');
    const end = moment(endDateStr, 'YYYY-MM-DD').startOf('day');
    console.log(today, start, end );
    console.log(today.isBefore(start));
    if (today.isBefore(start)) return 'Pending';
    if (today.isAfter(end)) return 'Done';
    return 'In Process';
}


// Pre-save hook for create and direct save()
kathaSchema.pre('save', function (next) {
    this.status = determineStatus(this.start_date, this.end_date);
    next();
});

// Pre hook for findOneAndUpdate or updateOne
kathaSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Fetch existing document if needed
    const existing = await this.model.findOne(this.getQuery());
    const start = update.start_date || existing.start_date;
    const end = update.end_date || existing.end_date;

    update.status = determineStatus(start, end);
    this.setUpdate(update);
    next();
});

module.exports = mongoose.model('Katha', kathaSchema);
