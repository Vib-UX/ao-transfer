import fs from "node:fs";
import { message, result, createDataItemSigner } from "@permaweb/aoconnect";

export async function transferTokensNode(
  processId,
  recipient,
  quantity,
  walletPath
) {
  try {
    // Load the wallet file and create the signer
    const wallet = JSON.parse(fs.readFileSync(walletPath, "utf8"));
    const signer = createDataItemSigner(wallet);

    // Send the transfer message
    const response = await message({
      process: processId,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Recipient", value: recipient },
        { name: "Quantity", value: quantity.toString() },
      ],
      signer,
      data: null,
    });

    console.log("Raw Response:", response);

    // Await the result of the transfer
    const r = await result({
      message: response,
      process: processId,
    });

    console.log("Transfer Successful:", r);

    return { rawResponse: response, result: r };
  } catch (error) {
    console.error("Transfer Failed:", error);
    throw error;
  }
}
