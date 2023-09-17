export const snake2NameCase = (str) => {
    return str.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
};