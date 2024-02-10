export const formatTime = (time) => {
    let [hours, minutes, meridiem] = [...time.slice(0, -2).split(':'), time.slice(-2)];
    hours = meridiem.toLowerCase() === 'pm' ? +hours + 12 : hours;
    return `${hours}:${minutes}`;
}