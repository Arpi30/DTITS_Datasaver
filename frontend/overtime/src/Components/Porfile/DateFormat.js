export const DateFormat = (time) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Intl.DateTimeFormat("hu-HU", options).format(time);
}