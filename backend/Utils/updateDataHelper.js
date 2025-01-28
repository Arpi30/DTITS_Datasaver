const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return (day === 6) || (day === 0);
};

const calculateOvertime = (start, end, type) => {
    if (type !== 'Készenlét') {
        return 0;
    }

    let totalDuration = 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Kezdő nap óráinak kiszámítása
    totalDuration += isWeekend(startDate) ? (24 - startDate.getHours()) : (24 - startDate.getHours());
    // Vég nap óráinak kiszámítása
    totalDuration += isWeekend(endDate) ? endDate.getHours() : endDate.getHours();

    // Köztes napok kezelése
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate < endDate && currentDate.toDateString() !== endDate.toDateString()) {
        totalDuration += isWeekend(currentDate) ? 24 : 13
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDuration;
};

module.exports = {
    calculateOvertime
}