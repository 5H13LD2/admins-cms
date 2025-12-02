import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Migration script to fix and validate existing Daily Challenges
 * This ensures all daily challenges have the correct data structure
 */
export async function migrateDailyChallenges() {
    try {
        console.log('Starting Daily Challenges migration...');

        // Get all daily challenges
        const challengesSnapshot = await getDocs(collection(db, 'daily_challenges'));
        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const challengeDoc of challengesSnapshot.docs) {
            const challengeData = challengeDoc.data();
            const challengeId = challengeDoc.id;

            try {
                let needsUpdate = false;
                const updates: any = {};

                // Check and fix required fields
                if (!challengeData.title) {
                    console.log(`⚠️  Challenge ${challengeId} missing title, skipping...`);
                    errorCount++;
                    continue;
                }

                // Ensure compilerType is valid
                const validCompilerTypes = ['javacompiler', 'pythoncompiler'];
                if (!validCompilerTypes.includes(challengeData.compilerType)) {
                    updates.compilerType = 'javacompiler';
                    needsUpdate = true;
                }

                // Ensure courseId is valid
                const validCourseIds = ['java', 'python'];
                if (!validCourseIds.includes(challengeData.courseId)) {
                    updates.courseId = challengeData.compilerType === 'pythoncompiler' ? 'python' : 'java';
                    needsUpdate = true;
                }

                // Ensure difficulty is valid
                const validDifficulties = ['easy', 'medium', 'hard'];
                if (!validDifficulties.includes(challengeData.difficulty)) {
                    updates.difficulty = 'easy';
                    needsUpdate = true;
                }

                // Ensure description exists
                if (!challengeData.description) {
                    updates.description = challengeData.title;
                    needsUpdate = true;
                }

                // Ensure problemStatement exists
                if (!challengeData.problemStatement) {
                    updates.problemStatement = challengeData.description || challengeData.title;
                    needsUpdate = true;
                }

                // Ensure points is a number
                if (typeof challengeData.points !== 'number') {
                    updates.points = parseInt(challengeData.points) || 100;
                    needsUpdate = true;
                }

                // Ensure isActive is a boolean
                if (typeof challengeData.isActive !== 'boolean') {
                    updates.isActive = true;
                    needsUpdate = true;
                }

                // Ensure createdAt exists and is a Timestamp
                if (!challengeData.createdAt) {
                    updates.createdAt = Timestamp.now();
                    needsUpdate = true;
                } else if (!(challengeData.createdAt instanceof Timestamp)) {
                    try {
                        if (challengeData.createdAt.toDate) {
                            updates.createdAt = challengeData.createdAt;
                        } else if (challengeData.createdAt instanceof Date) {
                            updates.createdAt = Timestamp.fromDate(challengeData.createdAt);
                        } else if (typeof challengeData.createdAt === 'string') {
                            updates.createdAt = Timestamp.fromDate(new Date(challengeData.createdAt));
                        } else {
                            updates.createdAt = Timestamp.now();
                        }
                        needsUpdate = true;
                    } catch (e) {
                        updates.createdAt = Timestamp.now();
                        needsUpdate = true;
                    }
                }

                // Ensure expiredAt exists and is a Timestamp
                if (!challengeData.expiredAt) {
                    // Set expiration to 24 hours from createdAt
                    const createdAt = challengeData.createdAt || Timestamp.now();
                    const expirationDate = new Date(createdAt.toDate());
                    expirationDate.setHours(expirationDate.getHours() + 24);
                    updates.expiredAt = Timestamp.fromDate(expirationDate);
                    needsUpdate = true;
                } else if (!(challengeData.expiredAt instanceof Timestamp)) {
                    try {
                        if (challengeData.expiredAt.toDate) {
                            updates.expiredAt = challengeData.expiredAt;
                        } else if (challengeData.expiredAt instanceof Date) {
                            updates.expiredAt = Timestamp.fromDate(challengeData.expiredAt);
                        } else if (typeof challengeData.expiredAt === 'string') {
                            updates.expiredAt = Timestamp.fromDate(new Date(challengeData.expiredAt));
                        } else {
                            const createdAt = challengeData.createdAt || Timestamp.now();
                            const expirationDate = new Date(createdAt.toDate());
                            expirationDate.setHours(expirationDate.getHours() + 24);
                            updates.expiredAt = Timestamp.fromDate(expirationDate);
                        }
                        needsUpdate = true;
                    } catch (e) {
                        const createdAt = challengeData.createdAt || Timestamp.now();
                        const expirationDate = new Date(createdAt.toDate());
                        expirationDate.setHours(expirationDate.getHours() + 24);
                        updates.expiredAt = Timestamp.fromDate(expirationDate);
                        needsUpdate = true;
                    }
                }

                // Ensure hints is an array
                if (!Array.isArray(challengeData.hints)) {
                    if (typeof challengeData.hints === 'string') {
                        updates.hints = [challengeData.hints];
                    } else {
                        updates.hints = [];
                    }
                    needsUpdate = true;
                }

                // Ensure tags is an array
                if (!Array.isArray(challengeData.tags)) {
                    if (typeof challengeData.tags === 'string') {
                        updates.tags = [challengeData.tags];
                    } else {
                        updates.tags = [];
                    }
                    needsUpdate = true;
                }

                // Ensure testCases is an array with proper structure
                if (!Array.isArray(challengeData.testCases)) {
                    updates.testCases = [];
                    needsUpdate = true;
                } else {
                    // Validate test cases structure
                    const validTestCases = challengeData.testCases.filter((tc: any) => {
                        return tc &&
                            typeof tc === 'object' &&
                            typeof tc.input === 'string' &&
                            typeof tc.expectedOutput === 'string' &&
                            typeof tc.isHidden === 'boolean';
                    });

                    if (validTestCases.length !== challengeData.testCases.length) {
                        updates.testCases = validTestCases;
                        needsUpdate = true;
                    }
                }

                if (needsUpdate) {
                    await updateDoc(doc(db, 'daily_challenges', challengeId), updates);
                    console.log(
                        `✅ Updated challenge "${challengeData.title}" (${challengeId})`
                    );
                    console.log(`   Updates:`, Object.keys(updates).join(', '));
                    updatedCount++;
                } else {
                    console.log(
                        `⏭️  Skipped challenge "${challengeData.title}" (${challengeId}): already valid`
                    );
                    skippedCount++;
                }
            } catch (error) {
                console.error(`❌ Error processing challenge ${challengeId}:`, error);
                errorCount++;
            }
        }

        console.log('\n✨ Migration complete!');
        console.log(`   Updated: ${updatedCount} challenges`);
        console.log(`   Skipped: ${skippedCount} challenges`);
        console.log(`   Errors: ${errorCount} challenges`);
        console.log(`   Total: ${challengesSnapshot.size} challenges`);

        return {
            updatedCount,
            skippedCount,
            errorCount,
            total: challengesSnapshot.size
        };
    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    }
}

// Uncomment to run directly with: npx tsx src/scripts/migrateDailyChallenges.ts
// migrateDailyChallenges()
//     .then(() => {
//         console.log('Migration finished successfully');
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error('Migration failed:', error);
//         process.exit(1);
//     });
