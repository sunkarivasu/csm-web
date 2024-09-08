export const formatDate = (isoString) => {
    // Create a Date object from the ISO string
    const date = new Date(isoString);

    // Get the day, month, and year
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();

    // Get hours and minutes
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Suffix for the day (st, nd, rd, th)
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                   day % 10 === 2 && day !== 12 ? 'nd' :
                   day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    // Format the date string
    return `${day}${suffix} ${month} ${year}: ${hours}:${minutes} ${ampm}`;
}