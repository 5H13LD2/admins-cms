import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Migration script to initialize moduleCount for existing courses
 * Run this once to fix courses that don't have moduleCount set
 */
export async function migrateModuleCount() {
    try {
        console.log('Starting moduleCount migration...');

        // Get all courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        let updatedCount = 0;
        let skippedCount = 0;

        for (const courseDoc of coursesSnapshot.docs) {
            const courseData = courseDoc.data();
            const courseId = courseDoc.id;

            // Get modules for this course
            const modulesSnapshot = await getDocs(
                collection(db, `courses/${courseId}/modules`)
            );
            const actualModuleCount = modulesSnapshot.size;

            // Check if moduleCount needs to be updated
            const currentModuleCount = courseData.moduleCount;

            if (currentModuleCount === undefined || currentModuleCount !== actualModuleCount) {
                // Update the course with the correct module count
                await updateDoc(doc(db, 'courses', courseId), {
                    moduleCount: actualModuleCount
                });

                console.log(
                    `✅ Updated course "${courseData.title}" (${courseId}): ${currentModuleCount ?? 'undefined'} → ${actualModuleCount} modules`
                );
                updatedCount++;
            } else {
                console.log(
                    `⏭️  Skipped course "${courseData.title}" (${courseId}): already has correct moduleCount (${actualModuleCount})`
                );
                skippedCount++;
            }
        }

        console.log('\n✨ Migration complete!');
        console.log(`   Updated: ${updatedCount} courses`);
        console.log(`   Skipped: ${skippedCount} courses`);
        console.log(`   Total: ${coursesSnapshot.size} courses`);

        return { updatedCount, skippedCount, total: coursesSnapshot.size };
    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    }
}

// Uncomment to run directly with: npx tsx src/scripts/migrateModuleCount.ts
// migrateModuleCount()
//   .then(() => {
//     console.log('Migration finished successfully');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('Migration failed:', error);
//     process.exit(1);
//   });
