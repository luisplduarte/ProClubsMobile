/**
 * Util functions that may be needed in different parts of the code
 */

export default function capitalizeFirstLetter(name: string): string {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}