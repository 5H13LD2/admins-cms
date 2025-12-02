import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Diagnostic script to check module counts vs actual modules
 * Run with: npx tsx src/scripts/checkModuleCounts.ts
 */
async function checkModuleCounts() {
    try {
        console.log('🔍 Checking module counts for all courses...\n');

        // Get all courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));

        if (coursesSnapshot.empty) {
            console.log('❌ No courses found in database');
            return;
        }

        console.log(`Found ${coursesSnapshot.size} courses\n`);
        console.log('─'.repeat(80));

        for (const courseDoc of coursesSnapshot.docs) {
            const courseData = courseDoc.data();
            const courseId = courseDoc.id;

            // Get actual modules for this course
            const modulesSnapshot = await getDocs(
                collection(db, `courses/${courseId}/modules`)
            );
            const actualModuleCount = modulesSnapshot.size;
            const storedModuleCount = courseData.moduleCount;

            // Check if there's a mismatch
            const status = storedModuleCount === undefined
                ? '❌ MISSING'
                : storedModuleCount === actualModuleCount
                    ? '✅ OK'
                    : '⚠️  MISMATCH';

            console.log(`${status} | "${courseData.title}"`);
            console.log(`   Course ID: ${courseId}`);
            console.log(`   Stored moduleCount: ${storedModuleCount ?? 'undefined'}`);
            console.log(`   Actual modules: ${actualModuleCount}`);

            if (actualModuleCount > 0) {
                console.log(`   Module IDs: ${modulesSnapshot.docs.map(d => d.id).join(', ')}`);
            }
            console.log('─'.repeat(80));
        }

        console.log('\n📊 Summary:');
        console.log(`   Total courses: ${coursesSnapshot.size}`);

        let missingCount = 0;
        let mismatchCount = 0;
        let okCount = 0;

        coursesSnapshot.docs.forEach(courseDoc => {
            const moduleCount = courseDoc.data().moduleCount;
            if (moduleCount === undefined) {
                missingCount++;
            } else {
                okCount++;
            }
        });

        console.log(`   ✅ OK: ${okCount}`);
        console.log(`   ❌ Missing moduleCount: ${missingCount}`);
        console.log(`   ⚠️  Mismatch: ${mismatchCount}`);

        if (missingCount > 0 || mismatchCount > 0) {
            console.log('\n💡 Run the migration to fix these issues:');
            console.log('   Option 1: Visit http://localhost:5173/admin/migrations');
            console.log('   Option 2: Run: npx tsx src/scripts/migrateModuleCount.ts');
        }

    } catch (error) {
        console.error('❌ Error checking module counts:', error);
        throw error;
    }
}

// Run the diagnostic
checkModuleCounts()
    .then(() => {
        console.log('\n✨ Diagnostic complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Diagnostic failed:', error);
        process.exit(1);
    });
