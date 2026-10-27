import { Floorplan, AppointmentBooking } from '../types';
import floorplansJson from './floorplans.json';

export const INITIAL_FLOORPLANS: Floorplan[] = floorplansJson as Floorplan[];

export const INITIAL_BOOKINGS: AppointmentBooking[] = [
  {
    id: 'book-1',
    ticketNumber: 'A-12',
    clientName: 'Marcus & Elena Vance',
    phone: '(360) 895-2144',
    email: 'vance.family@example.com',
    type: 'live_waitlist',
    date: 'Today',
    timeSlot: 'Now (Queue)',
    interestedPlanName: 'Dream Silver Casita',
    notes: 'Looking for 1-bed ADU on acreage in Port Orchard. Ready in 60 days.',
    partySize: 2,
    status: 'in_consultation',
    createdAt: '11:15 AM'
  },
  {
    id: 'book-2',
    ticketNumber: 'A-13',
    clientName: 'David Chen',
    phone: '(360) 479-3011',
    email: 'chen.d@example.com',
    type: 'live_waitlist',
    date: 'Today',
    timeSlot: 'Now (Queue)',
    interestedPlanName: 'Redwood II (ING 382F)',
    notes: 'Interested in double-wide 3D tour and Kitsap county lot placement.',
    partySize: 3,
    status: 'waiting',
    createdAt: '11:22 AM'
  },
  {
    id: 'book-3',
    ticketNumber: 'A-14',
    clientName: 'Sarah Jenkins',
    phone: '(360) 692-7491',
    email: 'sarah.j@example.com',
    type: 'future_appointment',
    date: '2026-10-29',
    timeSlot: '2:00 PM',
    interestedPlanName: 'Columbia River 2022',
    notes: 'Meeting with senior sales consultant regarding foundation permits in Silverdale.',
    partySize: 1,
    status: 'scheduled',
    createdAt: '10:45 AM'
  }
];
