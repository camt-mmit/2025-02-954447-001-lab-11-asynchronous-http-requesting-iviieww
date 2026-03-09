import { GoogleResource } from '../google';

export interface CalendarResource<K extends string> extends GoogleResource {
  readonly kind: `'calendar${K}'`;
}
/**
 * Represents the response from an Events: list request.
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/events/list
 */
export interface CalendarEventsListResponse extends CalendarResource<'events'> {
  /** ETag of the collection. */
  readonly etag: string;
  /** Title of the calendar. Read-only. */
  readonly summary?: string;
  /** Description of the calendar. Read-only. */
  readonly description?: string;
  /** Last modification time of the calendar (as a RFC3339 timestamp). Read-only. */
  readonly updated?: string;
  /** The time zone of the calendar. Read-only. */
  readonly timeZone?: string;
  /** The user's access role for this calendar. Read-only. */
  readonly accessRole?: 'none' | 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  /** The default reminders on the calendar for the authenticated user. */
  readonly defaultReminders: readonly CalendarReminder[];
  /** Token used to access the next page of this result. */
  readonly nextPageToken?: string;
  /** Token used at a later point in time to retrieve only the entries that have changed since this result was returned. */
  readonly nextSyncToken?: string;
  /** List of events on the calendar. */
  readonly items: readonly CalendarEvent[];
}

/**
 * Represents a single event on a calendar.
 */
export interface CalendarEvent extends CalendarResource<'event'> {
  /** ETag of the resource. */
  readonly etag: string;
  /** Opaque identifier of the event. */
  readonly id: string;
  /** Status of the event. */
  readonly status?: 'confirmed' | 'tentative' | 'cancelled';
  /** An absolute link to this event in the Google Calendar Web UI. Read-only. */
  readonly htmlLink?: string;
  /** Creation time of the event (as a RFC3339 timestamp). Read-only. */
  readonly created?: string;
  /** Last modification time of the event (as a RFC3339 timestamp). Read-only. */
  readonly updated?: string;
  /** Title of the event. */
  readonly summary?: string;
  /** Description of the event. */
  readonly description?: string;
  /** Geographic location of the event as free-form text. */
  readonly location?: string;
  /** The color of the event. */
  readonly colorId?: string;
  /** The creator of the event. */
  readonly creator?: {
    readonly id?: string;
    readonly email?: string;
    readonly displayName?: string;
    readonly self?: boolean;
  };
  /** The organizer of the event. */
  readonly organizer?: {
    readonly id?: string;
    readonly email?: string;
    readonly displayName?: string;
    readonly self?: boolean;
  };
  /** The (inclusive) start time of the event. */
  readonly start: EventDateTime;
  /** The (exclusive) end time of the event. */
  readonly end: EventDateTime;
  /** Whether the end time is actually unspecified. */
  readonly endTimeUnspecified?: boolean;
  /** List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. */
  readonly recurrence?: readonly string[];
  /** For an instance of a recurring event, this is the id of the recurring event to which this instance belongs. */
  readonly recurringEventId?: string;
  /** For an instance of a recurring event, this is the time at which this event would start according to the recurrence data. */
  readonly originalStartTime?: EventDateTime;
  /** Whether the event blocks time on the calendar. */
  readonly transparency?: 'opaque' | 'transparent';
  /** Visibility of the event. */
  readonly visibility?: 'default' | 'public' | 'private' | 'confidential';
  /** Event unique identifier as defined in RFC5545. */
  readonly iCalUID?: string;
  /** Sequence number as per iCalendar. */
  readonly sequence?: number;
  /** The attendees of the event. */
  readonly attendees?: readonly EventAttendee[];
  /** Whether attendees may have been omitted from the event's representation. */
  readonly attendeesOmitted?: boolean;
  /** Information about the event's reminders for the authenticated user. */
  readonly reminders?: {
    readonly useDefault: boolean;
    readonly overrides?: readonly CalendarReminder[];
  };
  /** Source from which the event was created. */
  readonly source?: {
    readonly url?: string;
    readonly title?: string;
  };
  /** File attachments for the event. */
  readonly attachments?: readonly EventAttachment[];
  /** Specific type of the event. */
  readonly eventType?:
    | 'default'
    | 'outOfOffice'
    | 'focusTime'
    | 'workingLocation'
    | 'birthday'
    | 'fromGmail';
}

/**
 * Represents the date and time of an event.
 */
export interface EventDateTime {
  /** The date, in the format "yyyy-mm-dd", if this is an all-day event. */
  readonly date?: string;
  /** The time, as a combined date-time value (RFC3339). */
  readonly dateTime?: string;
  /** The time zone in which the time is specified. */
  readonly timeZone?: string;
}

/**
 * Represents an attendee of an event.
 */
export interface EventAttendee {
  /** The attendee's Profile ID, if available. */
  readonly id?: string;
  /** The attendee's email address, if available. */
  readonly email?: string;
  /** The attendee's name, if available. */
  readonly displayName?: string;
  /** Whether the attendee is the organizer of the event. Read-only. */
  readonly organizer?: boolean;
  /** Whether the attendee is a resource. */
  readonly resource?: boolean;
  /** Whether this is an optional attendee. */
  readonly optional?: boolean;
  /** The attendee's response status. */
  readonly responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  /** Number of additional guests. */
  readonly additionalGuests?: number;
  /** The attendee's comment. */
  readonly comment?: string;
}

/**
 * Represents a reminder for a calendar or event.
 */
export interface CalendarReminder {
  /** The method used by this reminder. */
  readonly method: 'email' | 'popup';
  /** Number of minutes before the start of the event when the reminder should trigger. */
  readonly minutes: number;
}

/**
 * Represents a file attachment for an event.
 */
export interface EventAttachment {
  /** URL link to the attachment. */
  readonly fileUrl: string;
  /** Title of the attachment. */
  readonly title?: string;
  /** MIME type of the attachment. */
  readonly mimeType?: string;
  /** URL link to the attachment's icon. */
  readonly iconLink?: string;
  /** ID of the attached file. */
  readonly fileId?: string;
}

/**
 * Parameters for the Events: list request.
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/events/list
 */
export interface CalendarEventsListRequest {
  /** * Calendar identifier. To retrieve calendar events for the primary
   * calendar, use the "primary" keyword.
   */
  readonly calendarId: string;
  /** * Whether to include deleted events (with status "cancelled") in the result.
   * Cancelled instances of recurring events will still be included if
   * singleEvents is False. Optional. The default is False.
   */
  readonly showDeleted?: boolean;
  /** * Whether to include hidden invitations in the result. Optional.
   * The default is False.
   */
  readonly showHiddenInvitations?: boolean;
  /** * Lower bound (exclusive) for an event's end time to filter by.
   * Optional. The default is not to filter by end time.
   * Must be an RFC3339 timestamp.
   */
  readonly timeMin?: string;
  /** * Upper bound (exclusive) for an event's start time to filter by.
   * Optional. The default is not to filter by start time.
   * Must be an RFC3339 timestamp.
   */
  readonly timeMax?: string;
  /** * Maximum number of events returned on one result page.
   * The number of events in the resulting page may be less than this
   * value, or none at all. Optional.
   */
  readonly maxResults?: number;
  /** * The order of the events returned in the result.
   * Optional. The default is an unspecified, stable order.
   */
  readonly orderBy?: 'startTime' | 'updated';
  /** * Token specifying which result page to return. Optional.
   */
  readonly pageToken?: string;
  /** * Token obtained from the nextSyncToken field which allows retrieving
   * only entries that have changed since the last run. Optional.
   */
  readonly syncToken?: string;
  /** * Whether to expand recurring events into instances and only return
   * single one-off events and instances of recurring events.
   * Optional. The default is False.
   */
  readonly singleEvents?: boolean;
  /** * Free text search terms to find events that match these terms in any
   * field, except for extended properties. Optional.
   */
  readonly q?: string;
  /** * Event types to return. Optional.
   * This can be used multiple times in the URL, but as a TS type, we use a readonly array.
   */
  readonly eventTypes?: readonly (
    | 'default'
    | 'outOfOffice'
    | 'focusTime'
    | 'workingLocation'
    | 'birthday'
    | 'fromGmail'
  )[];
  /** * Time zone used in the response. Optional. The default is the
   * calendar's time zone.
   */
  readonly timeZone?: string;
}
