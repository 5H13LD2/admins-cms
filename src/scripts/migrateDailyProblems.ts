import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Migration script to fix and validate existing Daily Problems
 * This ensures all daily problems have the correct data structure
 */
export async function migrateDailyProblems() {
    try {
        console.log('Starting Daily Problems migration...');

        // Get all daily problems
        const problemsSnapshot = await getDocs(collection(db, 'daily_problem'));
        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const problemDoc of problemsSnapshot.docs) {
            const problemData = problemDoc.data();
            const problemId = problemDoc.id;

            try {
                let needsUpdate = false;
                const updates: any = {};

                // Check and fix required fields
                if (!problemData.title) {
                    console.log(`⚠️  Problem ${problemId} missing title, skipping...`);
                    errorCount++;
                    continue;
                }

                // Ensure difficulty is valid
                const validDifficulties = ['Easy', 'Medium', 'Hard'];
                if (!validDifficulties.includes(problemData.difficulty)) {
                    updates.difficulty = 'Easy';
                    needsUpdate = true;
                }

                // Ensure type is valid
                const validTypes = ['code', 'quiz', 'algorithm'];
                if (!validTypes.includes(problemData.type)) {
                    updates.type = 'code';
                    needsUpdate = true;
                }

                // Ensure description exists
                if (!problemData.description) {
                    updates.description = problemData.title;
                    needsUpdate = true;
                }

                // Ensure content exists
                if (!problemData.content) {
                    updates.content = problemData.description || problemData.title;
                    needsUpdate = true;
                }

                // Ensure points is a number
                if (typeof problemData.points !== 'number') {
                    updates.points = parseInt(problemData.points) || 10;
                    needsUpdate = true;
                }

                // Ensure date field exists and is a Timestamp
                if (!problemData.date) {
                    updates.date = Timestamp.now();
                    needsUpdate = true;
                } else if (!(problemData.date instanceof Timestamp)) {
                    // Try to convert to Timestamp
                    try {
                        if (problemData.date.toDate) {
                            // Already a Timestamp, just needs to be saved correctly
                            updates.date = problemData.date;
                        } else if (problemData.date instanceof Date) {
                            updates.date = Timestamp.fromDate(problemData.date);
                        } else if (typeof problemData.date === 'string') {
                            updates.date = Timestamp.fromDate(new Date(problemData.date));
                        } else {
                            updates.date = Timestamp.now();
                        }
                        needsUpdate = true;
                    } catch (e) {
                        updates.date = Timestamp.now();
                        needsUpdate = true;
                    }
                }

                // Ensure hints is an array if it exists
                if (problemData.hints && !Array.isArray(problemData.hints)) {
                    if (typeof problemData.hints === 'string') {
                        updates.hints = [problemData.hints];
                    } else {
                        delete updates.hints;
                    }
                    needsUpdate = true;
                }

                // Add timestamps if missing
                if (!problemData.createdAt) {
                    updates.createdAt = Timestamp.now();
                    needsUpdate = true;
                }

                if (!problemData.updatedAt) {
                    updates.updatedAt = Timestamp.now();
                    needsUpdate = true;
                }

                if (needsUpdate) {
                    await updateDoc(doc(db, 'daily_problem', problemId), updates);
                    console.log(
                        `✅ Updated problem "${problemData.title}" (${problemId})`
                    );
                    console.log(`   Updates:`, Object.keys(updates).join(', '));
                    updatedCount++;
                } else {
                    console.log(
                        `⏭️  Skipped problem "${problemData.title}" (${problemId}): already valid`
                    );
                    skippedCount++;
                }
            } catch (error) {
                console.error(`❌ Error processing problem ${problemId}:`, error);
                errorCount++;
            }
        }

        console.log('\n✨ Migration complete!');
        console.log(`   Updated: ${updatedCount} problems`);
        console.log(`   Skipped: ${skippedCount} problems`);
        console.log(`   Errors: ${errorCount} problems`);
        console.log(`   Total: ${problemsSnapshot.size} problems`);

        return {
            updatedCount,
            skippedCount,
            errorCount,
            total: problemsSnapshot.size
        };
    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    }
}

// Uncomment to run directly with: npx tsx src/scripts/migrateDailyProblems.ts
// migrateDailyProblems()
//     .then(() => {
//         console.log('Migration finished successfully');
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error('Migration failed:', error);
//         process.exit(1);
//     });
