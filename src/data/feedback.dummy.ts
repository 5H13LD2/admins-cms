import { Feedback } from '@/types';

export const dummyFeedback: Feedback[] = [
  {
    id: 'fb-1',
    userId: 'user-1',
    username: 'john_doe',
    type: 'feature',
    subject: 'Add Dark Mode',
    message: 'It would be great to have a dark mode option for the platform. My eyes get tired during long study sessions.',
    status: 'pending',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'fb-2',
    userId: 'user-2',
    username: 'jane_smith',
    type: 'bug',
    subject: 'Quiz Timer Issue',
    message: 'The quiz timer seems to reset when I switch tabs. This is causing issues during timed assessments.',
    status: 'reviewed',
    createdAt: new Date('2024-03-12'),
  },
  {
    id: 'fb-3',
    userId: 'user-3',
    username: 'bob_johnson',
    type: 'content',
    subject: 'More Python Examples',
    message: 'The Python course is great, but I think adding more practical examples would help understand concepts better.',
    status: 'resolved',
    createdAt: new Date('2024-03-08'),
    resolvedAt: new Date('2024-03-14'),
    response: 'Thank you for the feedback! We have added 10 new practical examples to the Python course.',
  },
  {
    id: 'fb-4',
    userId: 'user-4',
    username: 'alice_brown',
    type: 'general',
    subject: 'Great Platform!',
    message: 'Just wanted to say this platform is amazing. The courses are well-structured and easy to follow.',
    status: 'resolved',
    createdAt: new Date('2024-03-11'),
    resolvedAt: new Date('2024-03-11'),
    response: 'Thank you so much for your kind words! We are glad you are enjoying the platform.',
  },
];

