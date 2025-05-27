const Banner = require('../models/Banner');
const Katha = require('../models/Katha');
const Seva = require('../models/Seva');
const Setting = require('../models/Setting');
const Photo = require('../models/Photo');

const formatImagePath = (item, imageField = 'image', folder = '') => {
    const fileName = item[imageField];
    return {
        ...item.toObject(),
        [imageField]: fileName
            ? `${process.env.URL}${folder ? '/uploads' : ''}/${folder ? folder + '/' : ''}${fileName.replace(/\\/g, '/')}`
            : null
    };
};

const getHomepageData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    const [rawBanners, rawKathas, rawSevas, rawPhotos, settings] = await Promise.all([
        Banner.find({status: 'active'}).sort({createdAt: 1}),
        Katha.find({}).sort({createdAt: -1}),
        Seva.find({status: 'active'}).sort({createdAt: -1}),
        Photo.find({status: 'active', is_featured: true}).sort({createdAt: -1}).limit(15),
        Setting.find({name: {$in: ['bank_logo', 'bank_name', 'branch_name', 'acc_number', 'ifsc_code', 'live_darshan', 'mobile']}})
    ]);
    const upcomingKathas = rawKathas.filter(katha => {
        if (!katha.end_date) return false;
        const [year, month, day] = katha.end_date.split('-');
        const endDateObj = new Date(`${year}-${month}-${day}`);
        return endDateObj >= today;
    });

    const banners = rawBanners.map(b => formatImagePath(b, 'photo'));
    const kathas = upcomingKathas.map(k => formatImagePath(k, 'image', 'kathas'));
    const sevas = rawSevas.map(s => formatImagePath(s, 'image', 'sevas'));
    const photos = rawPhotos.map(p => formatImagePath(p, 'image', 'photos'));

    const bankDetails = {};
    let live_darshan_value = '';
    let mobile_value = '';
    settings.forEach(setting => {
        if (setting.name === 'live_darshan') {
            live_darshan_value = setting.value;
        } else if (setting.name === 'mobile') {
            mobile_value = setting.value;
        } else {
            bankDetails[setting.name] = setting.value;
        }
    });
    bankDetails.bank_logo = process.env.URL + '/uploads/settings/' + bankDetails.bank_logo;
    return {
        banners,
        kathas,
        sevas,
        photos,
        bankDetails,
        live_darshan: live_darshan_value,
        mobile: mobile_value
    };
};

const getDonateData = async () => {
    const [rawSevas, settings] = await Promise.all([


        Seva.find({status: 'active'}).sort({createdAt: -1}),
        Setting.find({name: {$in: ['bank_logo', 'bank_name', 'branch_name', 'acc_number', 'ifsc_code']}})
    ]);


    const sevas = rawSevas.map(s => formatImagePath(s, 'image', 'sevas'));

    const bankDetails = {};
    settings.forEach(setting => {
        bankDetails[setting.name] = setting.value;
    });
    bankDetails['bank_logo'] = process.env.URL + '/uploads/settings/' + bankDetails.bank_logo;
    return {
        bankDetails,
        sevas
    };
};


module.exports = {
    getHomepageData, getDonateData

};
