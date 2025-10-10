/**
 * CSV Parser for LP deposits data
 */

export interface DepositRecord {
  transactionHash: string;
  status: string;
  from: string;
  fromNameTag: string;
  to: string;
  resolvedAddress: string; // The actual LP address (resolved from name tag if needed)
}

// Known name tag to address mappings (these would need to be resolved via API in production)
// For now, I'll create placeholder addresses for the name tags we see frequently
const NAME_TAG_TO_ADDRESS: Record<string, string> = {
  "xabbu.bera": "0x1234567890123456789012345678901234567890", // Placeholder
  "jaspergb.bera": "0x2345678901234567890123456789012345678901", // Placeholder
  "cucamines.bera": "0x3456789012345678901234567890123456789012", // Placeholder
  "crypt0gang.bera": "0x4567890123456789012345678901234567890123", // Placeholder
  "yehafiz.bera": "0x5678901234567890123456789012345678901234", // Placeholder
  "gudbera.bera": "0x6789012345678901234567890123456789012345", // Placeholder
  "hyper.bera": "0x7890123456789012345678901234567890123456", // Placeholder
  "tristan.bera": "0x8901234567890123456789012345678901234567", // Placeholder
  "hoyasaxa.bera": "0x9012345678901234567890123456789012345678", // Placeholder
  "satanelrudo.bera": "0xa123456789012345678901234567890123456789", // Placeholder
  "ojali.bera": "0xb234567890123456789012345678901234567890", // Placeholder
};

/**
 * Parses CSV content and extracts deposit records
 */
export function parseCSVContent(csvContent: string): DepositRecord[] {
  const lines = csvContent.trim().split("\n");
  const records: DepositRecord[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV line (handling quoted fields)
    const fields = parseCSVLine(line);
    if (fields.length < 8) continue;

    const from = fields[5]?.replace(/"/g, "").trim() || "";
    const fromNameTag = fields[6]?.replace(/"/g, "").trim() || "";
    const to = fields[7]?.replace(/"/g, "").trim() || "";

    // Resolve the actual address
    let resolvedAddress = from;
    if (!from && fromNameTag) {
      resolvedAddress = NAME_TAG_TO_ADDRESS[fromNameTag] || fromNameTag;
    }

    if (resolvedAddress) {
      records.push({
        transactionHash: fields[0]?.replace(/"/g, "").trim() || "",
        status: fields[1]?.replace(/"/g, "").trim() || "",
        from,
        fromNameTag,
        to,
        resolvedAddress,
      });
    }
  }

  return records;
}

/**
 * Simple CSV line parser that handles quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

/**
 * Extracts unique LP addresses from deposit records
 */
export function extractUniqueLPAddresses(records: DepositRecord[]): string[] {
  const addressSet = new Set<string>();

  records.forEach((record) => {
    if (record.resolvedAddress && record.resolvedAddress.startsWith("0x")) {
      addressSet.add(record.resolvedAddress.toLowerCase());
    }
  });

  return Array.from(addressSet);
}

/**
 * Groups records by LP address
 */
export function groupRecordsByLP(
  records: DepositRecord[]
): Record<string, DepositRecord[]> {
  const grouped: Record<string, DepositRecord[]> = {};

  records.forEach((record) => {
    const address = record.resolvedAddress.toLowerCase();
    if (!grouped[address]) {
      grouped[address] = [];
    }
    grouped[address].push(record);
  });

  return grouped;
}

/**
 * Gets LP statistics from records
 */
export function getLPStatistics(records: DepositRecord[]) {
  const uniqueAddresses = extractUniqueLPAddresses(records);
  const successfulDeposits = records.filter((r) => r.status === "Success");
  const failedDeposits = records.filter((r) => r.status !== "Success");

  return {
    totalTransactions: records.length,
    uniqueLPs: uniqueAddresses.length,
    successfulDeposits: successfulDeposits.length,
    failedDeposits: failedDeposits.length,
    uniqueAddresses,
  };
}
