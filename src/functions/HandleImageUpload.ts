import { app, InvocationContext } from "@azure/functions";
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import { CosmosClient } from "@azure/cosmos";
import { BlobServiceClient } from "@azure/storage-blob";

export async function HandleImageUpload(event: any, context: InvocationContext): Promise<void> {
    // Lấy tên file từ Event Grid event
    const blobUrl = event.data?.url as string;
    const fileName = blobUrl.split('/').pop() as string;
    context.log(`Phát hiện ảnh mới: ${fileName}`);

    try {
        // 1. Download blob để phân tích
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.ocrstoragechuong_STORAGE as string
        );
        const containerClient = blobServiceClient.getContainerClient("images");
        const blobClient = containerClient.getBlobClient(fileName);
        const downloadResponse = await blobClient.download();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadResponse.readableStreamBody as any) {
            chunks.push(Buffer.from(chunk));
        }
        const blobBuffer = Buffer.concat(chunks);

        // 2. OCR
        const client = new DocumentAnalysisClient(
            process.env.OCR_ENDPOINT as string,
            new AzureKeyCredential(process.env.OCR_KEY as string)
        );
        const poller = await client.beginAnalyzeDocument("prebuilt-read", blobBuffer);
        const { content } = await poller.pollUntilDone();

        // 3. Lưu vào Cosmos DB
        const cosmosClient = new CosmosClient(process.env.COSMOS_DB_CONNECTION as string);
        const container = cosmosClient.database("ocr-db-chuong").container("results");
        await container.items.upsert({
            id: fileName.replace(/[^a-zA-Z0-9]/g, "_"),
            fileName,
            textContent: content,
            processedAt: new Date().toISOString()
        });

        context.log(`Thành công! ${fileName} đã lưu vào Database.`);
    } catch (error: any) {
        context.log(`Lỗi: ${error.message}`);
        context.log(`Stack: ${error.stack}`);
    }
}

app.eventGrid('HandleImageUpload', {
    handler: HandleImageUpload
});