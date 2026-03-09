"use server";

import fs from 'fs/promises';
import * as XLSX from 'xlsx';

/**
 * Reads a CSV file and returns it as a 2D array of strings.
 * @param filePath The absolute path to the CSV file.
 * @returns A Promise resolving to a 2D array of strings.
 */
export async function readCsv(filePath: string): Promise<string[][]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const workbook = XLSX.read(fileContent, { type: 'string' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // header: 1 returns array of arrays
    // defval: "" ensures empty cells are empty strings instead of undefined/null
    return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as string[][];
  } catch (error) {
    console.error("Error reading CSV:", error);
    throw new Error(`Failed to read CSV file at ${filePath}`);
  }
}

/**
 * Writes a 2D array of strings to a CSV file.
 * @param filePath The absolute path to the CSV file.
 * @param data The 2D array of data to write.
 */
export async function writeCsv(filePath: string, data: string[][]): Promise<void> {
  try {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    await fs.writeFile(filePath, csvContent, 'utf-8');
  } catch (error) {
    console.error("Error writing CSV:", error);
    throw new Error(`Failed to write CSV file at ${filePath}`);
  }
}

/**
 * Reads a YAML file and returns its content as a string.
 * @param filePath The absolute path to the YAML file.
 * @returns A Promise resolving to the file content string.
 */
export async function readYaml(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error("Error reading YAML:", error);
    throw new Error(`Failed to read YAML file at ${filePath}`);
  }
}

/**
 * Writes content to a YAML file.
 * @param filePath The absolute path to the YAML file.
 * @param content The string content to write.
 */
export async function writeYaml(filePath: string, content: string): Promise<void> {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error("Error writing YAML:", error);
    throw new Error(`Failed to write YAML file at ${filePath}`);
  }
}
