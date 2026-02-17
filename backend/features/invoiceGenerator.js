const fs = require("fs");
const path = require("path");

async function ensureDir(dir) {
	return fs.promises.mkdir(dir, { recursive: true });
}

/**
 * Generate a simple invoice JSON file for a payment
 * @param {Object} payment - Payment mongoose document or plain object
 * @returns {Promise<string>} - path to generated invoice file
 */
async function generateInvoice(payment) {
	const invoicesDir = path.join(__dirname, "..", "invoices");
	await ensureDir(invoicesDir);

	const invoice = {
		invoiceId: `INV-${payment._id}`,
		paymentId: payment._id,
		client: payment.client,
		provider: payment.provider,
		amount: payment.amount,
		paymentMethod: payment.paymentMethod,
		paymentStatus: payment.paymentStatus,
		createdAt: new Date().toISOString()
	};

	const fileName = `invoice-${payment._id}.json`;
	const filePath = path.join(invoicesDir, fileName);

	await fs.promises.writeFile(filePath, JSON.stringify(invoice, null, 2), "utf8");

	return filePath;
}

module.exports = {
	generateInvoice
};

