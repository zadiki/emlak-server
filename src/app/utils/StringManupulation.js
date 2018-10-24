export const toUpperCase = (lower) => {
    let upper = lower.replace(/^\w/, c => c.toUpperCase());
    return upper;
}