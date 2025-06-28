function validatePhoneNumber(phoneNumber) {
    // Regex untuk memeriksa apakah nomor dimulai dengan 0 dan hanya terdiri dari angka
    const regex = /^08[0-9]+$/;


    if (regex.test(phoneNumber) && phoneNumber.length >= 6 && phoneNumber.length <= 13) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    validatePhoneNumber
};