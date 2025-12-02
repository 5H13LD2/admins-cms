import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Feedback } from '@/types/feedback.types';

export const useFeedbackNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Setting up feedback notification listener...');

        // Listen for new feedback (status = 'new')
        const feedbackQuery = query(
            collection(db, 'feedback'),
            where('status', '==', 'new'),
            orderBy('timestamp', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(
            feedbackQuery,
            (snapshot) => {
            

                const newFeedback = snapshot.docs.map(doc => {
                    const data = doc.data();
                   
                    return {
                        id: doc.id,
                        ...data
                    };
                }) as Feedback[];

   
                setRecentFeedback(newFeedback);
                setUnreadCount(snapshot.size);
                setIsLoading(false);
            },
            (error) => {
             

                // If it's an index error, log helpful message
                if (error.code === 'failed-precondition') {
                    console.error('FIRESTORE INDEX REQUIRED: The query requires an index.');
                    console.error('Check the error message for the index creation link.');
                }

                setIsLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => {
          
            unsubscribe();
        };
    }, []);

    return {
        unreadCount,
        recentFeedback,
        isLoading
    };
};
