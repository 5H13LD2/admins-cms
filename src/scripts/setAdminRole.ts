import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';

const USERS_COLLECTION = 'users';

/**
 * Sets the role of a user to 'admin' by email
 * @param email - The email address of the user to make admin
 * @returns Object with success status and message
 */
export const setAdminRole = async (email: string) => {
    try {
        if (!email || !email.trim()) {
            throw new Error('Email is required');
        }

        // Find user by email
        const q = query(
            collection(db, USERS_COLLECTION),
            where('email', '==', email.trim())
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error(`No user found with email: ${email}`);
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Check if already admin
        if (userData.role === 'admin') {
            return {
                success: true,
                message: `User ${email} is already an admin`,
                alreadyAdmin: true
            };
        }

        // Update user role to admin
        await updateDoc(doc(db, USERS_COLLECTION, userDoc.id), {
            role: 'admin'
        });

        return {
            success: true,
            message: `Successfully set ${email} as admin`,
            alreadyAdmin: false
        };
    } catch (error) {
        console.error('❌ Failed to set admin role:', error);
        throw error;
    }
};

/**
 * Sets multiple users as admins
 * @param emails - Array of email addresses
 * @returns Array of results for each email
 */
export const setMultipleAdminRoles = async (emails: string[]) => {
    const results = [];

    for (const email of emails) {
        try {
            const result = await setAdminRole(email);
            results.push({ email, ...result });
        } catch (error) {
            results.push({
                email,
                success: false,
                message: error instanceof Error ? error.message : 'Failed to set admin role'
            });
        }
    }

    return {
        total: emails.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
    };
};

/**
 * Gets all users and their roles
 * @returns Array of users with email and role
 */
export const getAllUserRoles = async () => {
    try {
        const snapshot = await getDocs(collection(db, USERS_COLLECTION));

        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                username: data.username,
                role: data.role || 'not set'
            };
        });

        return users;
    } catch (error) {
        console.error('❌ Failed to get user roles:', error);
        throw error;
    }
};
