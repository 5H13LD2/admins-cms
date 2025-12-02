import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';

/**
 * Migration script to ensure feedback documents have proper status values
 * and are accessible by the CMS admin panel
 *
 * This migration:
 * 1. Validates status values (converts to 'new', 'pending', 'reviewed', or 'resolved')
 * 2. Ensures all required fields exist
 * 3. Adds missing timestamps
 * 4. Safe to run multiple times
 */
export async function migrateFeedbackPermissions() {
    const feedbackRef = collection(db, 'feedback');
    const snapshot = await getDocs(feedbackRef);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const total = snapshot.size;

    // Process in batches of 500 (Firestore limit)
    const batchSize = 500;
    let batch = writeBatch(db);
    let operationCount = 0;

    console.log(`Processing ${total} feedback documents...`);

    for (const feedbackDoc of snapshot.docs) {
        try {
            const data = feedbackDoc.data();
            const updates: any = {};
            let needsUpdate = false;

            // Validate and fix status field
            const currentStatus = data.status;
            const validStatuses = ['new', 'pending', 'reviewed', 'resolved'];

            if (!currentStatus || !validStatuses.includes(currentStatus)) {
                // Default to 'new' if status is invalid or missing
                updates.status = 'new';
                needsUpdate = true;
                console.log(`Fixing status for feedback ${feedbackDoc.id}: "${currentStatus}" -> "new"`);
            }

            // Ensure required fields exist
            if (!data.userId) {
                console.warn(`Missing userId for feedback ${feedbackDoc.id}`);
                updates.userId = data.userId || 'unknown';
                needsUpdate = true;
            }

            if (!data.username) {
                console.warn(`Missing username for feedback ${feedbackDoc.id}`);
                updates.username = data.username || 'Anonymous';
                needsUpdate = true;
            }

            if (!data.userEmail) {
                console.warn(`Missing userEmail for feedback ${feedbackDoc.id}`);
                updates.userEmail = data.userEmail || 'unknown@example.com';
                needsUpdate = true;
            }

            if (!data.feedback) {
                console.warn(`Missing feedback content for ${feedbackDoc.id}`);
                updates.feedback = data.feedback || data.message || 'No content';
                needsUpdate = true;
            }

            // Ensure timestamp exists
            if (!data.timestamp) {
                if (data.createdAt) {
                    updates.timestamp = data.createdAt;
                } else {
                    updates.timestamp = new Date();
                }
                needsUpdate = true;
                console.log(`Adding timestamp for feedback ${feedbackDoc.id}`);
            }

            // Ensure appVersion exists
            if (!data.appVersion) {
                updates.appVersion = data.appVersion || 'v1.0.0';
                needsUpdate = true;
            }

            // Ensure deviceInfo exists
            if (!data.deviceInfo) {
                updates.deviceInfo = data.deviceInfo || 'Unknown Device';
                needsUpdate = true;
            }

            if (needsUpdate) {
                const docRef = doc(db, 'feedback', feedbackDoc.id);
                batch.update(docRef, updates);
                updatedCount++;
                operationCount++;

                // Commit batch if we reach the limit
                if (operationCount >= batchSize) {
                    await batch.commit();
                    batch = writeBatch(db);
                    operationCount = 0;
                    console.log(`Committed batch. Progress: ${updatedCount + skippedCount}/${total}`);
                }
            } else {
                skippedCount++;
            }
        } catch (error) {
            console.error(`Error processing feedback ${feedbackDoc.id}:`, error);
            errorCount++;
        }
    }

    // Commit any remaining operations
    if (operationCount > 0) {
        await batch.commit();
        console.log('Committed final batch');
    }

    console.log('Migration completed!');
    console.log(`Updated: ${updatedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}, Total: ${total}`);

    return {
        updatedCount,
        skippedCount,
        errorCount,
        total
    };
}
