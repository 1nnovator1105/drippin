import { redirect } from "next/navigation";
import { uniqueNamesGenerator, NumberDictionary } from "unique-names-generator";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function generateRandomName() {
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const characterName: string = uniqueNamesGenerator({
    dictionaries: [["Dangerous"], ["Snake"], numberDictionary],
    length: 3,
    separator: "",
    style: "capital",
  }); // DangerousSnake123
  return characterName;
}

// sec to mm:ss
export function secToTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function secToKoreanTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  if (minutes > 0 && seconds > 0) {
    return `${minutes}분 ${seconds}초`;
  } else if (minutes > 0) {
    return `${minutes}분`;
  } else {
    return `${seconds}초`;
  }
}
